import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {addressFragment, currencyFragment} from 'walless-graphql/misc.queries';
import {imageFragment} from 'walless-graphql/file.queries';

const restaurantFragment = gql`
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
        language
        name
        description
      }
    }
  }
  ${currencyFragment}
  ${imageFragment}
  ${addressFragment}
`;

const formatRestaurant = (restaurant = {}) => {
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

const getRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        ...restaurantInfo
      }
    }
    ${restaurantFragment}
  `, {
    skip: ownProps =>
      typeof ownProps.restaurant !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'number' ? ownProps.restaurant : null
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...getRestaurant} = data;
      return {
        restaurant: formatRestaurant(restaurantById),
        getRestaurant
      };
    }
  }
);


export {
  restaurantFragment,
  getRestaurant,
  formatRestaurant
};
