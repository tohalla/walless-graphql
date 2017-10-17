import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit, set, find, get} from 'lodash/fp';

import {
  restaurantFragment,
  restaurantI18nFragment,
  getRestaurantQuery
} from 'restaurant/restaurant.queries';
import {imageFragment} from 'file.queries';
import {dataIdFromObject} from 'util';

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
      createRestaurant: restaurant => mutate({
        variables: {input: {restaurant}},
        update: (store, {data: {createRestaurant: {restaurant}}}) =>
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

export const createRestaurantI18n = graphql(
  gql`
    mutation createRestaurantI18n($input: CreateRestaurantI18nInput!) {
      createRestaurantI18n(input: $input) {
        restaurantI18n {
          ...restaurantI18nInfo
        }
      }
    }
    ${restaurantI18nFragment}
  `, {
    props: ({mutate}) => ({
      createRestaurantI18n: items => {
        (Array.isArray(items) ? items : [items])
          .forEach(restaurantI18n =>
            mutate({
              variables: {
                input: {restaurantI18n}
              },
              update: (
                store,
                {data: {createRestaurantI18n: {restaurantI18n}}}
              ) => {
                if (!store.restaurantById) return;
                const oldRestaurant = store.readQuery({
                  query: getRestaurantQuery,
                  variables: {id: restaurantI18n.restaurant}
                });
                const oldI18n = get([
                  'restaurantById',
                  'restaurantI18nsByRestaurant',
                  'nodes'
                ])(oldRestaurant);
                // should push translation to i18n, if it doesn't already exists
                if (!find(i => i.language === restaurantI18n.language)(oldI18n)) {
                  store.writeQuery({
                    query: getRestaurantQuery,
                    data: set([
                      'restaurantById',
                      'restaurantI18nsByRestaurant',
                      'nodes'
                    ])(oldI18n.concat(restaurantI18n))(oldRestaurant)
                  });
                }
              }
            })
          );
      }
    })
  }
);

export const updateRestaurantI18n = graphql(
  gql`
    mutation updateRestaurantI18n($input: UpdateRestaurantI18nInput!) {
      updateRestaurantI18n(input: $input) {
        restaurantI18n {
          ...restaurantI18nInfo
        }
      }
    }
    ${restaurantI18nFragment}
  `, {
    props: ({mutate}) => ({
      updateRestaurantI18n: (items) =>
        (Array.isArray(items) ? items : [items])
          .forEach(restaurantI18n =>
            mutate({
              variables: {
                input: {
                  restaurantI18n: omit(['__typename', 'nodeId'])(restaurantI18n)
                }
              },
              update: (
                store,
                {data: {updateRestaurantI18n: {restaurantI18n}}}
              ) => store.writeFragment({
                fragment: restaurantI18nFragment,
                id: dataIdFromObject(restaurantI18n),
                data: restaurantI18n
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
          if (!store.restaurantById) return;
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
