// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit} from 'lodash/fp';

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
  mutation updateMenuItem($input: UpdateMenuItemInput!) {
    updateMenuItem(input: $input) {
      menuItem {
        ...menuItemInfo
      }
    }
  }
  ${menuItemFragment}
  `, {
    props: ({mutate}) => ({
      updateMenuItem: (menuItem: {id: Number}) => mutate({variables: {
        input: {menuItem: omit(['__typename', 'nodeId'])(menuItem)}
      }})
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
  mutation updateMenuItemInformation($input: UpdateMenuItemInformationInput!) {
    updateMenuItemInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemInformation: (menuItemInformationItems: Object[] | Object) =>
        (Array.isArray(menuItemInformationItems) ? menuItemInformationItems : [menuItemInformationItems])
          .forEach(menuItemInformation =>
            mutate({variables: {
              input: {
                menuItemInformation: omit(['__typename', 'nodeId'])(menuItemInformation)
              }
            }})
          )
    })
  }
);

const updateMenuItemImages = graphql(
  gql`
  mutation updateMenuItemImages($input: UpdateMenuItemImagesInput!) {
    updateMenuItemImages(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemImages: (menuItem: Number, images: Number[]) => mutate({
        variables: {
          input: {menuItem, images}
        }
      })
    })
  }
);

export {
  createMenuItem,
  updateMenuItem,
  updateMenuItemImages,
  createMenuItemInformation,
  updateMenuItemInformation
};
