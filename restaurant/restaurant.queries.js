import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {addressFragment, currencyFragment} from 'walless-graphql/misc.queries';
import {imageFragment} from 'walless-graphql/file.queries';

export const restaurantInformationFragment = gql`
  fragment restaurantInformationInfo on RestaurantInformation {
    language
    name
    description
    nodeId
  }
`;

export const restaurantFragment = gql`
  fragment restaurantInfo on Restaurant {
    id
    nodeId
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
    restaurantInformationsByRestaurant {
      nodes {
        ...restaurantInformationInfo
      }
    }
  }
  ${currencyFragment}
  ${imageFragment}
  ${addressFragment}
  ${restaurantInformationFragment}
`;

export const formatRestaurant = (restaurant = {}) => {
  const {
    restaurantInformationsByRestaurant = {},
    currencyByCurrency: currency,
    restaurantImagesByRestaurant = {},
    addressByAddress: address,
    ...rest
  } = restaurant;
  const information = Array.isArray(restaurantInformationsByRestaurant.nodes) ?
    restaurantInformationsByRestaurant.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  const images = Array.isArray(restaurantImagesByRestaurant.nodes) ?
    restaurantImagesByRestaurant.nodes.map(node => node.imageByImage) : [];
  return Object.assign(
    {},
    rest,
    {
      information,
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
        restaurant: formatRestaurant(restaurantById),
        getRestaurant
      };
    }
  }
);

