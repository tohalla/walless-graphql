import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {
  menuItemFragment,
  formatMenuItem
} from 'walless-graphql/restaurant/menuItem.queries';

const menuFragment = gql`
  fragment menuInfo on Menu {
    nodeId
    id
    menuInformationsByMenu {
      nodes {
        nodeId
        language
        name
        description
      }
    }
    menuMenuItemsByMenu {
      edges {
        node {
          menuItemByMenuItem {
            ...menuItemInfo
          }
        }
      }
    }
  }
  ${menuItemFragment}
`;

const formatMenu = (menu = {}) => {
  const {
    menuMenuItemsByMenu = {},
    menuInformationsByMenu = {},
    ...rest
  } = menu;
  const menuItems = Array.isArray(menuMenuItemsByMenu.edges) ?
    menuMenuItemsByMenu.edges.map(edge =>
      formatMenuItem(edge.node.menuItemByMenuItem)
    ) : [];
  const information = Array.isArray(menuInformationsByMenu.nodes) ?
    menuInformationsByMenu.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign({}, rest, {menuItems, information});
};

const getMenu = graphql(
  gql`
    query menuById($id: Int!) {
      id
      menuById(id: $id) {
        ...menuInfo
      }
    }
    ${menuFragment}
  `, {
    skip: ownProps => typeof ownProps.menu !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.menu === 'number' ? ownProps.menu : null
      }
    }),
    props: ({ownProps, data}) => {
      const {menuById, ...getMenu} = data;
      return {
        menu: formatMenu(menuById),
        getMenu
      };
    }
  }
);

const getMenusByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        nodeId
        menusByRestaurant {
          edges {
            node {
              ...menuInfo
            }
          }
        }
      }
    }
    ${menuFragment}
  `, {
    skip: ownProps =>
      !ownProps.restaurant,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'object' ?
          ownProps.restaurant.id : ownProps.restaurant
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...getMenusByRestaurant} = data;
      return {
        menus: (get(['menusByRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => formatMenu(edge.node)),
        getMenusByRestaurant
      };
    }
  }
);

export {menuFragment, getMenu, formatMenu, getMenusByRestaurant};
