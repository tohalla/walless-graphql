import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {
  formatRestaurant,
  restaurantFragment
} from 'walless-graphql/restaurant/restaurant.queries';

const accountFragment = gql`
  fragment accountInformation on Account {
    id
    firstName
    lastName
    emailByEmail {
      id
      email
    }
  }
`;

const roleRightsFragment = gql`
  fragment roleRights on RestaurantRoleRight {
    id
    allowAddPromotion
    allowAlterPromotion
    allowDeletePromotion
    allowAddMenu
    allowAlterMenu
    allowDeleteMenu
    allowAddMenuItem
    allowAlterMenuItem
    allowDeleteMenuItem
    allowChangeRestaurantDescription
    allowChangeRestaurantDescription
    allowAlterRestaurantRoles
    allowMapRoles
  }
`;

const formatAccount = (account = {}) => {
  const {
    restaurantAccountsByAccount = {},
    ...rest
  } = account;
  const restaurants = Array.isArray(restaurantAccountsByAccount.edges) ?
    restaurantAccountsByAccount.edges.map(edge =>
      formatRestaurant(edge.node.restaurantByRestaurant)
    ) : [];
  return Object.assign({}, rest, {restaurants});
};

const getActiveAccount = graphql(
  gql`
    query {
      getActiveAccount {
        ...accountInformation
        restaurantAccountsByAccount {
          edges {
            node {
              restaurantByRestaurant {
                ...restaurantInfo
              }
            }
          }
        }
      }
    }
    ${accountFragment}
    ${restaurantFragment}
  `,
  {
    props: ({ownProps, data: {getActiveAccount: account, ...rest}}) => {
      return {
        getActiveAccount: {
          account: formatAccount(account),
          data: rest
        }
      };
    }
  }
);

export {
  accountFragment,
  roleRightsFragment,
  getActiveAccount,
  formatAccount
};
