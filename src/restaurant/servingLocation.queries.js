import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {
  accountFragment,
  formatAccount
} from '../account/account.fragments';

export const servingLocationFragment = gql`
  fragment servingLocationInfo on ServingLocation {
    id
    name
    enabled
    createdAt
    restaurant
    servingLocationAccountsByServingLocation {
      nodes {
        accountByAccount {
          ...accountInfo
        }
      }
    }
  }
  ${accountFragment}
`;

export const formatServingLocation = (servingLocation = {}) => {
  const {
    servingLocationAccountsByServingLocation = {},
    ...rest
  } = servingLocation;
  const accounts = Array.isArray(servingLocationAccountsByServingLocation.nodes) ?
    servingLocationAccountsByServingLocation.nodes.map(node =>
      formatAccount(node.accountByAccount)
    ) : [];
  return Object.assign({}, rest, {accounts});
};

export const getServingLocation = graphql(
  gql`
    query servingLocationById($id: Int!) {
      servingLocationById(id: $id) {
        ...servingLocationInfo
      }
    }
    ${servingLocationFragment}
  `, {
    skip: ownProps => typeof ownProps.servingLocation !== 'number',
    options: ownProps => ({
      variables: {
        id: ownProps.servingLocation
      }
    }),
    props: ({ownProps, data}) => {
      const {servingLocationById, ...getServingLocation} = data;
      return {
        servingLocation: formatServingLocation(servingLocationById),
        getServingLocation
      };
    }
  }
);

export const getServingLocationsByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        id
        servingLocationsByRestaurant {
          edges {
            node {
              ...servingLocationInfo
            }
          }
        }
      }
    }
    ${servingLocationFragment}
  `, {
    skip: ownProps =>
      !ownProps.restaurant,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'object' ?
          ownProps.restaurant.id : ownProps.restaurant
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...getServingLocationsByRestaurant} = data;
      return {
        servingLocations: getServingLocationsByRestaurant.loading ? [] :
          (get(['servingLocationsByRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => formatServingLocation(edge.node)),
        getServingLocationsByRestaurant
      };
    }
  }
);

