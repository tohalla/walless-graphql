import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {addressFragment, currencyFragment} from 'walless-graphql/misc.queries';
import {imageFragment} from 'walless-graphql/file.queries';

export const restaurantI18nFragment = gql`
  fragment restaurantI18nInfo on RestaurantI18n {
    language
    name
    description
    nodeId
    restaurant
  }
`;

export const restaurantFragment = gql`
  fragment restaurantInfo on Restaurant {
    id
    createdBy
    addressByAddress {
      ...addressInfo
    }
    restaurantImagesByRestaurant {
      nodes {
        imageByImage {
          ...imageInfo
        }
      }
    }
    currencyByCurrency {
      ...currencyInfo
    }
    restaurantI18nsByRestaurant {
      nodes {
        ...restaurantI18nInfo
      }
    }
  }
  ${currencyFragment}
  ${imageFragment}
  ${addressFragment}
  ${restaurantI18nFragment}
`;

export const formatRestaurant = (restaurant = {}) => {
  const {
    restaurantI18nsByRestaurant = {},
    currencyByCurrency: currency,
    restaurantImagesByRestaurant = {},
    addressByAddress: address,
    ...rest
  } = restaurant;
  const i18n = Array.isArray(restaurantI18nsByRestaurant.nodes) ?
    restaurantI18nsByRestaurant.nodes.reduce(
      (prev, val) => {
        const {language, ...restI18n} = val;
        return Object.assign({}, prev, {[language]: restI18n});
      },
      {}
    ) : [];
  const images = Array.isArray(restaurantImagesByRestaurant.nodes) ?
    restaurantImagesByRestaurant.nodes.map(node => node.imageByImage) : [];
  return Object.assign(
    {},
    rest,
    {
      i18n,
      currency,
      images,
      address
    }
  );
};

export const getRestaurantQuery = gql`
  query restaurantById($id: Int!) {
    restaurantById(id: $id) {
      ...restaurantInfo
    }
  }
  ${restaurantFragment}
`;

export const getRestaurant = graphql(
  getRestaurantQuery,
  {
    skip: ownProps => typeof ownProps.restaurant !== 'number',
    options: ownProps => ({variables: {id: ownProps.restaurant}}),
    props: ({ownProps, data}) => {
      const {restaurantById, ...getRestaurant} = data;
      return {
        restaurant: getRestaurant.loading ?
          ownProps.restaurant : formatRestaurant(restaurantById),
        getRestaurant
      };
    }
  }
);

