import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {
  formatRestaurant,
  restaurantFragment
} from 'walless-graphql/restaurant/restaurant.queries';
import {accountFragment} from 'walless-graphql/account/account.fragments';

const formatAccount = (account = {}) => {
  if (!account) {
    return account;
  }
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
        ...accountInfo
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
  getActiveAccount,
  formatAccount
};
