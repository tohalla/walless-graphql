// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {menuItemFragment} from 'walless-graphql/restaurant/menuItem.queries';

const createMenuItem = graphql(
  gql`
  mutation createMenuItem($menuItem: CreateMenuItemInput!) {
    createMenuItem(input: $menuItem) {
      menuItem {
        ...menuItemInfo
      }
    }
  }
  ${menuItemFragment}
  `, {
    props: ({mutate, data}) => ({
      createMenuItem: menuItem => mutate({
        variables: {menuItem: {menuItem}}
      })
    })
  }
);

const updateMenuItem = graphql(
  gql`
  mutation updateMenuItemById($input: UpdateMenuItemByIdInput!) {
    updateMenuItemById(input: $input) {
      menuItem {
        ...menuItemInfo
      }
    }
  }
  ${menuItemFragment}
  `, {
    props: ({mutate}) => ({
      updateMenuItem: (menuItem: {id: Number}) => mutate({
        variables: {
          input: {
            id: menuItem.id,
            menuItemPatch: menuItem
          }
        }
      })
    })
  }
);

const createMenuItemInformation = graphql(
  gql`
  mutation createMenuItemInformation($input: CreateMenuItemInformationInput!) {
    createMenuItemInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      createMenuItemInformation: (menuItemInformationItems: Object[] | Object) => {
        (Array.isArray(menuItemInformationItems) ? menuItemInformationItems : [menuItemInformationItems])
          .forEach(menuItemInformation =>
            mutate({
              variables: {
                input: {menuItemInformation}
              }
            })
          );
      }
    })
  }
);

const updateMenuItemInformation = graphql(
  gql`
  mutation updateMenuItemInformation($input: UpdateMenuItemInformationByLanguageAndMenuItemInput!) {
    updateMenuItemInformationByLanguageAndMenuItem(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemInformation: (menuItemInformationItems: Object[] | Object) => {
        (Array.isArray(menuItemInformationItems) ? menuItemInformationItems : [menuItemInformationItems])
          .forEach(menuItemInformation => {
            const {
              menuItem,
              language,
              __typename, // eslint-disable-line
              nodeId, // eslint-disable-line
              ...information
            } = menuItemInformation;
            mutate({
              variables: {
                input: {
                  menuItem,
                  language,
                  menuItemInformationPatch: information
                }
              }
            });
          });
      }
    })
  }
);

const updateMenuItemFiles = graphql(
  gql`
  mutation updateMenuItemFiles($input: UpdateMenuItemFilesInput!) {
    updateMenuItemFiles(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemFiles: (menuItem: Number, files: Number[]) => mutate({
        variables: {
          input: {menuItem, files}
        }
      })
    })
  }
);

export {
  createMenuItem,
  updateMenuItem,
  updateMenuItemFiles,
  createMenuItemInformation,
  updateMenuItemInformation
};
