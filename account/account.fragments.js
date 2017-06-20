import gql from 'graphql-tag';

import {formatRestaurant} from 'walless-graphql/restaurant/restaurant.queries';

const formatAccount = (account = {}) => {
  if (!account) {
    return account;
  }
  const {
    restaurantAccountsByAccount = {},
    emailByEmail: email,
    ...rest
  } = account;
  const restaurants = Array.isArray(restaurantAccountsByAccount.edges) ?
    restaurantAccountsByAccount.edges.map(edge =>
      formatRestaurant(edge.node.restaurantByRestaurant)
    ) : [];
  return Object.assign({}, rest, {
    restaurants,
    email
  });
};

const accountFragment = gql`
  fragment accountInfo on Account {
    nodeId
    id
    firstName
    lastName
    emailByEmail {
      nodeId
      id
      email
    }
  }
`;

const roleRightsFragment = gql`
  fragment roleRightsInfo on RestaurantRoleRight {
    id
    nodeId
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

export {
  accountFragment,
  formatAccount,
  roleRightsFragment
};
