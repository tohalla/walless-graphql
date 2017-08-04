import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {imageFragment} from 'walless-graphql/file.queries';
import {
  currencyFragment,
  dietFragment,
  formatDiet
} from 'walless-graphql/misc.queries';

const menuItemTypeFragment = gql`
  fragment menuItemTypeInfo on MenuItemType {
    nodeId
    id
    name
    description
  }
`;

const menuItemCategoryFragment = gql`
  fragment menuItemCategoryInfo on MenuItemCategory {
    nodeId
    id
    name
    description
  }
`;

const formatMenuItemCategory = (menuItemCategory = {}) => {
  const {
    menuItemTypeByType,
    ...rest
  } = menuItemCategory;
  return Object.assign(
    {},
    rest,
    menuItemTypeByType ? {menuItemType: menuItemTypeByType} : null
  );
};

const menuItemFragment = gql`
  fragment menuItemInfo on MenuItem {
    id
    nodeId
    restaurant
    createdAt
    createdBy
    price
    menuItemTypeByType {
      ...menuItemTypeInfo
    }
    menuItemCategoryByCategory {
      ...menuItemCategoryInfo
    }
    currencyByCurrency {
      ...currencyInfo
    }
    menuItemInformationsByMenuItem {
      nodes {
        nodeId
        language
        name
        description
      }
    }
    menuItemDietsByMenuItem {
      nodes {
        dietByDiet {
          ...dietInfo
        }
      }
    }
    menuItemImagesByMenuItem {
      edges {
        node {
          imageByImage {
            ...imageInfo
          }
        }
      }
    }
  }
  ${currencyFragment}
  ${dietFragment}
  ${imageFragment}
  ${menuItemTypeFragment}
  ${menuItemCategoryFragment}
`;

const formatMenuItem = (menuItem = {}) => {
  const {
    menuItemImagesByMenuItem = {},
    menuItemDietsByMenuItem = {},
    menuItemInformationsByMenuItem = {},
    menuItemCategoryByCategory = {},
    menuItemTypeByType = {},
    currencyByCurrency: currency,
    ...rest
  } = menuItem;
  const images = Array.isArray(menuItemImagesByMenuItem.edges) ?
    menuItemImagesByMenuItem.edges.map(edge => edge.node.imageByImage) : [];
  const diets = Array.isArray(menuItemDietsByMenuItem.nodes) ?
    menuItemDietsByMenuItem.nodes.map(node => formatDiet(node.dietByDiet)) : [];
  const information = Array.isArray(menuItemInformationsByMenuItem.nodes) ?
    menuItemInformationsByMenuItem.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign(
    {},
    rest,
    {
      images,
      information,
      currency,
      diets,
      menuItemCategory: formatMenuItemCategory(menuItemCategoryByCategory || {}),
      menuItemType: formatMenuItemType(menuItemTypeByType || {})
    }
  );
};

const formatMenuItemType = (menuItemType = {}) => {
  const {
    menuItemCategoriesByType,
    ...rest
  } = menuItemType;
  return Object.assign(
    {},
    rest,
    menuItemCategoriesByType ? {menuItemCategories: menuItemCategoriesByType.nodes} : null
  );
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
      const {menuItemById, ...getMenuItem} = data;
      return {
        menuItem: formatMenuItem(menuItemById),
        getMenuItem
      };
    }
  }
);

const getMenuItemTypes = graphql(
  gql`
    query allMenuItemTypes {
      allMenuItemTypes {
        nodes {
          ...menuItemTypeInfo
          menuItemCategoriesByType {
            nodes {
              ...menuItemCategoryInfo
            }
          }
        }
      }
    }
    ${menuItemTypeFragment}
    ${menuItemCategoryFragment}
  `, {
    props: ({ownProps, data}) => {
      const {allMenuItemTypes, ...getMenuItemTypes} = data;
      return {
        menuItemTypes: (get(['nodes'])(allMenuItemTypes) || [])
          .map(node => formatMenuItemType(node)),
        getMenuItemTypes
      };
    }
  }
);

const getMenuItemsByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        nodeId
        menuItemsByRestaurant {
          edges {
            node {
              ...menuItemInfo
            }
          }
        }
      }
    }
    ${menuItemFragment}
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
      const {restaurantById, ...getMenuItemsByRestaurant} = data;
      return {
        menuItems: (get(['menuItemsByRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => formatMenuItem(edge.node)),
        getMenuItemsByRestaurant
      };
    }
  }
);

export {
  menuItemFragment,
  getMenuItem,
  formatMenuItem,
  getMenuItemTypes,
  getMenuItemsByRestaurant
};
