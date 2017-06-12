import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {hasIn} from 'lodash/fp';

import {menuItemFragment} from 'walless-graphql/restaurant/menuItem.queries';

const menuFragment = gql`
  fragment menuInfo on Menu {
    id
    name
    description
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
  const {menuMenuItemsByMenu, ...rest} = menu;
  let menuItems = [];
  if (hasIn(['menuMenuItemsByMenu', 'edges'])(menu)) {
    menuItems = menuMenuItemsByMenu.edges
      .map(edge => edge.node.menuItemByMenuItem);
  }
  return Object.assign({}, rest, {menuItems});
};

const getMenu = graphql(
  gql`
    query menuById($id: Int!) {
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
      const {menuById, ...rest} = data;
      return {getMenu: {
        menu: formatMenu(menuById),
        data: rest
      }};
    }
  }
);

export {menuFragment, getMenu, formatMenu};
