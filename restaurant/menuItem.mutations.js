import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit, get} from 'lodash/fp';

import {menuItemFragment} from 'walless-graphql/restaurant/menuItem.queries';

export const createMenuItem = graphql(
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

export const updateMenuItem = graphql(
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
      updateMenuItem: (menuItem) => mutate({variables: {
        input: {menuItem: omit(['__typename', 'nodeId'])(menuItem)}
      }})
    })
  }
);

export const deleteMenuItem = graphql(
  gql`
  mutation deleteMenuItem($input: DeleteMenuItemInput!) {
    deleteMenuItem(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      deleteMenuItem: menuItem => mutate({variables: {
        input: {menuItem: get('id')(menuItem) || menuItem}
      }})
    })
  }
);


export const createMenuItemInformation = graphql(
  gql`
  mutation createMenuItemInformation($input: CreateMenuItemInformationInput!) {
    createMenuItemInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      createMenuItemInformation: (menuItemInformationItems) => {
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

export const updateMenuItemInformation = graphql(
  gql`
  mutation updateMenuItemInformation($input: UpdateMenuItemInformationInput!) {
    updateMenuItemInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemInformation: (menuItemInformationItems) =>
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

export const updateMenuItemImages = graphql(
  gql`
  mutation updateMenuItemImages($input: UpdateMenuItemImagesInput!) {
    updateMenuItemImages(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemImages: (menuItem, images) => mutate({
        variables: {
          input: {menuItem, images}
        }
      })
    })
  }
);

export const updateMenuItemDiets = graphql(
  gql`
  mutation updateMenuItemDiets($input: UpdateMenuItemDietsInput!) {
    updateMenuItemDiets(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemDiets: (menuItem, diets) => mutate({
        variables: {
          input: {menuItem, diets}
        }
      })
    })
  }
);

export const updateMenuItemIngredients = graphql(
  gql`
  mutation updateMenuItemIngredients($input: UpdateMenuItemIngredientsInput!) {
    updateMenuItemIngredients(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateMenuItemIngredients: ingredients => mutate({
        variables: {
          input: {ingredients}
        }
      })
    })
  }
);

