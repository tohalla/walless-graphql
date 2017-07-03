// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit} from 'lodash/fp';

import {restaurantFragment} from 'walless-graphql/restaurant/restaurant.queries';

const createRestaurant = graphql(
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

const createRestaurantInformation = graphql(
  gql`
  mutation createRestaurantInformation($input: CreateRestaurantInformationInput!) {
    createRestaurantInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      createRestaurantInformation: (items: Object[] | Object) => {
        (Array.isArray(items) ? items : [items])
          .forEach(restaurantInformation =>
            mutate({
              variables: {
                input: {restaurantInformation}
              }
            })
          );
      }
    })
  }
);

const updateRestaurantInformation = graphql(
  gql`
  mutation updateRestaurantInformation($input: UpdateRestaurantInformationInput!) {
    updateRestaurantInformation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateRestaurantInformation: (items: Object[] | Object) =>
        (Array.isArray(items) ? items : [items])
          .forEach(restaurantInformation =>
            mutate({variables: {
              input: {
                restaurantInformation: omit(['__typename', 'nodeId'])(restaurantInformation)
              }
            }})
          )
    })
  }
);

const updateRestaurant = graphql(
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
      updateRestaurant: (restaurant: {id: Number}) => mutate({variables: {
        input: {restaurant: omit(['__typename', 'nodeId'])(restaurant)}
      }})
    })
  }
);

const updateRestaurantImages = graphql(
  gql`
  mutation updateRestaurantImages($input: UpdateRestaurantImagesInput!) {
    updateRestaurantImages(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      updateRestaurantImages: (restaurant: Number, images: Number[]) => mutate({
        variables: {
          input: {restaurant, images}
        }
      })
    })
  }
);


export {
  createRestaurant,
  updateRestaurant,
  createRestaurantInformation,
  updateRestaurantInformation,
  updateRestaurantImages
};
