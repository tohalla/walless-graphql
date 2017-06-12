import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {restaurantFragment} from 'walless-graphql/restaurant/restaurant.queries';

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
        getActiveAccount: {account, data: rest}
      };
    }
  }
);

export {
  accountFragment,
  roleRightsFragment,
  getActiveAccount
};
