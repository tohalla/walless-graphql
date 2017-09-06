import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit, set, find, get} from 'lodash/fp';

import {
  restaurantFragment,
  restaurantInformationFragment,
  getRestaurantQuery
} from 'walless-graphql/restaurant/restaurant.queries';
import {imageFragment} from 'walless-graphql/file.queries';
import {dataIdFromObject} from 'walless-graphql/util';

export const createRestaurant = graphql(
  gql`
    mutation createRestaurant($input: CreateRestaurantInput!) {
      createRestaurant(input: $input) {
        restaurant {
          ...restaurantInfo
        }
      }
    }
    ${restaurantFragment}
  `, {
    props: ({mutate}) => ({
      createRestaurant: restaurant => mutate({variables: {input: {restaurant}}})
    })
  }
);

export const createRestaurantInformation = graphql(
  gql`
    mutation createRestaurantInformation($input: CreateRestaurantInformationInput!) {
      createRestaurantInformation(input: $input) {
        restaurantInformation {
          ...restaurantInformationInfo
        }
      }
    }
    ${restaurantInformationFragment}
  `, {
    props: ({mutate}) => ({
      createRestaurantInformation: (items) => {
        (Array.isArray(items) ? items : [items])
          .forEach(restaurantInformation =>
            mutate({
              variables: {
                input: {restaurantInformation}
              },
              update: (
                store,
                {data: {createRestaurantInformation: {restaurantInformation}}}
              ) => {
                const oldRestaurant = store.readQuery({
                  query: getRestaurantQuery,
                  variables: {id: restaurantInformation.restaurant}
                });
                const oldI18n = get([
                  'restaurantById',
                  'restaurantInformationsByRestaurant',
                  'nodes'
                ])(oldRestaurant);
                // should push translation to i18n, if it doesn't already exists
                if (!find(i => i.language === restaurantInformation.language)(oldI18n)) {
                  store.writeQuery({
                    query: getRestaurantQuery,
                    data: set([
                      'restaurantById',
                      'restaurantInformationsByRestaurant',
                      'nodes'
                    ])(oldI18n.concat(restaurantInformation))(oldRestaurant)
                  });
                }
              }
            })
          );
      }
    })
  }
);

export const updateRestaurantInformation = graphql(
  gql`
    mutation updateRestaurantInformation($input: UpdateRestaurantInformationInput!) {
      updateRestaurantInformation(input: $input) {
        restaurantInformation {
          ...restaurantInformationInfo
        }
      }
    }
    ${restaurantInformationFragment}
  `, {
    props: ({mutate}) => ({
      updateRestaurantInformation: (items) =>
        (Array.isArray(items) ? items : [items])
          .forEach(restaurantInformation =>
            mutate({
              variables: {
                input: {
                  restaurantInformation: omit(['__typename', 'nodeId'])(restaurantInformation)
                }
              },
              update: (
                store,
                {data: {updateRestaurantInformation: {restaurantInformation}}}
              ) => store.writeFragment({
                fragment: restaurantInformationFragment,
                id: dataIdFromObject(restaurantInformation),
                data: restaurantInformation
              })
            })
          )
    })
  }
);

export const updateRestaurant = graphql(
  gql`
    mutation updateRestaurant($input: UpdateRestaurantInput!) {
      updateRestaurant(input: $input) {
        restaurant {
          ...restaurantInfo
        }
      }
    }
  ${restaurantFragment}
  `, {
    props: ({mutate}) => ({
      updateRestaurant: (restaurant) => mutate({
        variables: {
          input: {restaurant: omit(['__typename', 'nodeId'])(restaurant)}
        },
        update: (store, {data: {updateRestaurant: {restaurant}}}) =>
          store.writeFragment({
            fragment: restaurantFragment,
            fragmentName: 'restaurantInfo',
            id: dataIdFromObject(restaurant),
            data: restaurant
          })
      })
    })
  }
);

export const updateRestaurantImages = graphql(
  gql`
    mutation updateRestaurantImages($input: UpdateRestaurantImagesInput!) {
      updateRestaurantImages(input: $input) {
        restaurantImages {
          imageByImage {
            ...imageInfo
          }
        }
      }
    }
    ${imageFragment}
  `, {
    props: ({mutate}) => ({
      updateRestaurantImages: (restaurant, images) => mutate({
        variables: {
          input: {restaurant, images}
        },
        update: (store, {data: {updateRestaurantImages: {restaurantImages}}}) => {
          const old = store.readQuery({
            query: getRestaurantQuery,
            variables: {id: restaurant}
          });
          store.writeQuery({
            query: getRestaurantQuery,
            data: set([
              'restaurantById',
              'restaurantImagesByRestaurant',
              'nodes'
            ])(restaurantImages)(old)
          });
        }
      })
    })
  }
);
