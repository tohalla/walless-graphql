import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit, get} from 'lodash/fp';

import {menuFragment} from 'restaurant/menu.queries';

export const createMenu = graphql(
  gql`
  mutation createMenu($input: CreateMenuInput!) {
    createMenu(input: $input) {
      menu {
        ...menuInfo
      }
    }
  }
  ${menuFragment}
  `, {
    props: ({mutate}) => ({
      createMenu: menu => mutate({variables: {input: {menu}}})
    })
  }
);

export const updateMenu = graphql(
  gql`
  mutation updateMenu($input: UpdateMenuInput!) {
    updateMenu(input: $input) {
      menu {
        ...menuInfo
      }
    }
  }
  ${menuFragment}
  `, {
    props: ({mutate}) => ({
      updateMenu: menu => mutate({variables: {
        input: {menu: omit(['__typename', 'nodeId'])(menu)}
      }})
    })
  }
);

export const deleteMenu = graphql(
  gql`
  mutation deleteMenu($input: DeleteMenuInput!) {
    deleteMenu(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      deleteMenu: menu => mutate({variables: {
        input: {menu: get('id')(menu) || menu}
      }})
    })
  }
);

export const createMenuI18n = graphql(
  gql`
  mutation createMenuI18n($input: CreateMenuI18nInput!) {
    createMenuI18n(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      createMenuI18n: (menuI18nItems) => {
        (Array.isArray(menuI18nItems) ? menuI18nItems : [menuI18nItems])
          .forEach(menuI18n =>
            mutate({
              variables: {
                input: {menuI18n}
              }
            })
          );
      }
    })
  }
);

export const updateMenuI18n = graphql(
  gql`
  mutation updateMenuI18n($input: UpdateMenuI18nInput!) {
    updateMenuI18n(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuI18n: (menuI18nItems) =>
        (Array.isArray(menuI18nItems) ? menuI18nItems : [menuI18nItems])
          .forEach(menuI18n =>
            mutate({variables: {
              input: {
                menuI18n: omit(['__typename', 'nodeId'])(menuI18n)
              }
            }})
          )
    })
  }
);

export const updateMenuItems = graphql(
  gql`
  mutation updateMenuItems($input: UpdateMenuItemsInput!) {
    updateMenuItems(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItems: (menu, menuItems) => mutate({
        variables: {
          input: {menu, menuItems}
        }
      })
    })
  }
);

