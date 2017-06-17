import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {fileFragment} from 'walless-graphql/file.queries';

const menuItemFragment = gql`
  fragment menuItemInfo on MenuItem {
    id
    nodeId
    restaurant
    createdAt
    createdBy
    category
    type
    price
    currency
    menuItemInformationsByMenuItem {
      nodes {
        nodeId
        language
        name
        description
      }
    }
    menuItemFilesByMenuItem {
      edges {
        node {
          fileByFile {
            ...fileInfo
          }
        }
      }
    }
  }
  ${fileFragment}
`;

const formatMenuItem = (menuItem = {}) => {
  const {
    menuItemFilesByMenuItem = {},
    menuItemInformationsByMenuItem = {},
    ...rest
  } = menuItem;
  const files = Array.isArray(menuItemFilesByMenuItem.edges) ?
    menuItemFilesByMenuItem.edges.map(edge => edge.node.fileByFile) : [];
  const information = Array.isArray(menuItemInformationsByMenuItem.nodes) ?
    menuItemInformationsByMenuItem.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign({}, rest, {files, information});
};

const getMenuItem = graphql(
  gql`
    query menuItemById($id: Int!) {
      menuItemById(id: $id) {
        ...menuItemInfo
      }
    }
    ${menuItemFragment}
  `, {
    skip: ownProps => typeof ownProps.menuItem !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.menuItem === 'number' ? ownProps.menuItem : null
      }
    }),
    props: ({ownProps, data}) => {
      const {menuItemById, ...rest} = data;
      return {getMenuItem: {
        menuItem: formatMenuItem(menuItemById),
        data: rest
      }};
    }
  }
);

export {
  menuItemFragment,
  getMenuItem,
  formatMenuItem
};
