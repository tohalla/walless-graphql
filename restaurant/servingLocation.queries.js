import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {
  accountFragment,
  formatAccount
} from 'walless-graphql/account/account.fragments';

const servingLocationFragment = gql`
  fragment servingLocationInfo on ServingLocation {
    nodeId
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

const formatServingLocation = (servingLocation = {}) => {
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

const getServingLocation = graphql(
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

export {
  servingLocationFragment,
  formatServingLocation,
  getServingLocation
};
