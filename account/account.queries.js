import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {restaurantFragment} from 'walless-graphql/restaurant/restaurant.queries';
import {
  formatAccount,
  accountFragment
} from 'walless-graphql/account/account.fragments';

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
