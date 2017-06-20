import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {accountFragment} from 'walless-graphql/account/account.fragments';
import {menuItemFragment} from 'walless-graphql/restaurant/menuItem.queries';

const orderFragment = gql`
  fragment orderInfo on Order {
    id
    nodeId
    createdAt
    completed
    accepted
    declined
    paid
    message
    accountByCreatedBy {
      ...accountInfo
    }
    orderMenuItemsByOrder {
      nodes {
        menuItemByMenuItem {
          ...menuItemInfo
        }
      }
    }
  }
  ${accountFragment}
  ${menuItemFragment}
`;

const formatOrder = (order = {}) => {
  const {
    accountByCreatedBy: orderer,
    orderMenuItemsByOrder: {nodes = []}
  } = order;
  return Object.assign(
    {},
    order,
    {
      orderer,
      items: nodes.map(node => node.menuItemByMenuItem)
    }
  );
};

const getOrder = graphql(
  gql`
    query orderById($id: Int!) {
      orderById(id: $id) {
        ...restaurantInfo
      }
    }
    ${orderFragment}
  `, {
    skip: ownProps =>
      typeof ownProps.order !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.order === 'number' ? ownProps.order : null
      }
    }),
    props: ({ownProps, data}) => {
      const {orderById, ...rest} = data;
      return {
        getOrder: {
          restaurant: formatOrder(orderById),
          data: rest
        }
      };
    }
  }
);

export {
  orderFragment,
  formatOrder,
  getOrder
};
