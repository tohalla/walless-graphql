import gql from 'graphql-tag';

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
  roleRightsFragment
};
