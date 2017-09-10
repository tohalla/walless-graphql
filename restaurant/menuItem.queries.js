import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {imageFragment} from 'walless-graphql/file.queries';
import {
  currencyFragment,
  dietFragment,
  formatDiet
} from 'walless-graphql/misc.queries';

export const menuItemTypeFragment = gql`
  fragment menuItemTypeInfo on MenuItemType {
    id
    name
    description
  }
`;

export const menuItemCategoryFragment = gql`
  fragment menuItemCategoryInfo on MenuItemCategory {
    id
    name
    description
  }
`;

export const formatMenuItemCategory = (menuItemCategory = {}) => {
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

export const menuItemFragment = gql`
  fragment menuItemInfo on MenuItem {
    id
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
    menuItemI18nsByMenuItem {
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

export const formatMenuItem = (menuItem = {}) => {
  const {
    menuItemImagesByMenuItem = {},
    menuItemDietsByMenuItem = {},
    menuItemI18nsByMenuItem = {},
    menuItemCategoryByCategory = {},
    menuItemTypeByType = {},
    currencyByCurrency: currency,
    ...rest
  } = menuItem;
  const images = Array.isArray(menuItemImagesByMenuItem.edges) ?
    menuItemImagesByMenuItem.edges.map(edge => edge.node.imageByImage) : [];
  const diets = Array.isArray(menuItemDietsByMenuItem.nodes) ?
    menuItemDietsByMenuItem.nodes.map(node => formatDiet(node.dietByDiet)) : [];
  const i18n = Array.isArray(menuItemI18nsByMenuItem.nodes) ?
    menuItemI18nsByMenuItem.nodes.reduce(
      (prev, val) => {
        const {language, ...restI18n} = val;
        return Object.assign({}, prev, {[language]: restI18n});
      },
      {}
    ) : [];
  return Object.assign(
    {},
    rest,
    {
      images,
      i18n,
      currency,
      diets,
      menuItemCategory: formatMenuItemCategory(menuItemCategoryByCategory || {}),
      menuItemType: formatMenuItemType(menuItemTypeByType || {})
    }
  );
};

export const formatMenuItemType = (menuItemType = {}) => {
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

export const getMenuItem = graphql(
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
        menuItem: getMenuItem.loading ?
          ownProps.menuItem : formatMenuItem(menuItemById),
        getMenuItem
      };
    }
  }
);

export const getMenuItemTypes = graphql(
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
        menuItemTypes: getMenuItemTypes.loading ? [] :
          (get(['nodes'])(allMenuItemTypes) || [])
            .map(node => formatMenuItemType(node)),
        getMenuItemTypes
      };
    }
  }
);

export const getMenuItemsByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        id
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
        menuItems: getMenuItemsByRestaurant.loading ? [] :
          (get(['menuItemsByRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => formatMenuItem(edge.node)),
        getMenuItemsByRestaurant
      };
    }
  }
);
