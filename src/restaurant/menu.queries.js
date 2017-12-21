import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {
  menuItemFragment,
  formatMenuItem
} from './menuItem.queries';

export const menuFragment = gql`
  fragment menuInfo on Menu {
    id
    menuI18nsByMenu {
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

export const formatMenu = (menu = {}) => {
  const {
    menuMenuItemsByMenu = {},
    menuI18nsByMenu = {},
    ...rest
  } = menu;
  const menuItems = Array.isArray(menuMenuItemsByMenu.edges) ?
    menuMenuItemsByMenu.edges.map(edge =>
      formatMenuItem(edge.node.menuItemByMenuItem)
    ) : [];
  const i18n = Array.isArray(menuI18nsByMenu.nodes) ?
    menuI18nsByMenu.nodes.reduce(
      (prev, val) => {
        const {language, ...restI18n} = val;
        return Object.assign({}, prev, {[language]: restI18n});
      },
      {}
    ) : [];
  return Object.assign({}, rest, {menuItems, i18n});
};

export const getMenuQuery = gql`
  query menuById($id: Int!) {
    id
    menuById(id: $id) {
      ...menuInfo
    }
  }
  ${menuFragment}
`;

export const getMenu = graphql(
  getMenuQuery,
  {
    skip: ownProps => typeof ownProps.menu !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.menu === 'number' ? ownProps.menu : null
      }
    }),
    props: ({ownProps, data}) => {
      const {menuById, ...getMenu} = data;
      return {
        menu: getMenu.loading ?
          ownProps.menu : formatMenu(menuById),
        getMenu
      };
    }
  }
);

export const getMenusByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        id
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
        menus: getMenusByRestaurant.loading ? [] :
          (get(['menusByRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => formatMenu(edge.node)),
        getMenusByRestaurant
      };
    }
  }
);
