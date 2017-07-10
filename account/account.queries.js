import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {
  restaurantFragment,
  formatRestaurant
} from 'walless-graphql/restaurant/restaurant.queries';
import {
  formatAccount,
  accountFragment
} from 'walless-graphql/account/account.fragments';

const getActiveAccount = graphql(
  gql`
    query {
      getActiveAccount {
        ...accountInfo
      }
    }
    ${accountFragment}
  `,
  {
    props: ({ownProps, data: {getActiveAccount: account, ...getActiveAccount}}) => {
      return {
        account: formatAccount(account),
        getActiveAccount
      };
    }
  }
);

const getRestaurantsByAccount = graphql(
  gql`
    query accountById($id: Int!) {
      accountById(id: $id) {
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
    ${restaurantFragment}
  `, {
    skip: ownProps =>
      typeof ownProps.account === 'object' && !get(['account', 'id'])(ownProps),
    options: ownProps => ({
      variables: {
        id: typeof ownProps.account === 'object' && ownProps.account ?
          ownProps.account.id : ownProps.account
      }
    }),
    props: ({ownProps, data}) => {
      const {accountById, ...getRestaurantsByAccount} = data;
      return {
        restaurants: (get(['restaurantAccountsByAccount', 'edges'])(accountById) || [])
          .map(edge => formatRestaurant(get(['node', 'restaurantByRestaurant'])(edge))),
        getRestaurantsByAccount
      };
    }
  }
);


export {
  getActiveAccount,
  formatAccount,
  getRestaurantsByAccount
};
