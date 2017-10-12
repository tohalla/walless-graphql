import gql from 'graphql-tag';

const formatAccount = (account = {}) => {
  return account;
};

const accountFragment = gql`
  fragment accountInfo on Account {
    id
    firstName
    lastName
    language
    email
  }
`;

const roleRightsFragment = gql`
  fragment roleRightsInfo on RestaurantRoleRight {
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

export {
  accountFragment,
  formatAccount,
  roleRightsFragment
};
