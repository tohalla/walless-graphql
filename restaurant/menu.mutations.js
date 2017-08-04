// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit, get} from 'lodash/fp';

import {menuFragment} from 'walless-graphql/restaurant/menu.queries';

const createMenu = graphql(
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

const updateMenu = graphql(
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

const deleteMenu = graphql(
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

const createMenuInformation = graphql(
  gql`
  mutation createMenuInformation($input: CreateMenuInformationInput!) {
    createMenuInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      createMenuInformation: (menuInformationItems: Object[] | Object) => {
        (Array.isArray(menuInformationItems) ? menuInformationItems : [menuInformationItems])
          .forEach(menuInformation =>
            mutate({
              variables: {
                input: {menuInformation}
              }
            })
          );
      }
    })
  }
);

const updateMenuInformation = graphql(
  gql`
  mutation updateMenuInformation($input: UpdateMenuInformationInput!) {
    updateMenuInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuInformation: (menuInformationItems: Object[] | Object) =>
        (Array.isArray(menuInformationItems) ? menuInformationItems : [menuInformationItems])
          .forEach(menuInformation =>
            mutate({variables: {
              input: {
                menuInformation: omit(['__typename', 'nodeId'])(menuInformation)
              }
            }})
          )
    })
  }
);

const updateMenuItems = graphql(
  gql`
  mutation updateMenuItems($input: UpdateMenuItemsInput!) {
    updateMenuItems(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItems: (menu: Number, menuItems: Number[]) => mutate({
        variables: {
          input: {menu, menuItems}
        }
      })
    })
  }
);

export {
  createMenu,
  updateMenu,
  deleteMenu,
  updateMenuItems,
  createMenuInformation,
  updateMenuInformation
};
