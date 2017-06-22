import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {accountFragment, formatAccount} from 'walless-graphql/account/account.fragments';
import {menuItemFragment, formatMenuItem} from 'walless-graphql/restaurant/menuItem.queries';

const orderItemFragment = gql`
  fragment orderItemInfo on OrderItem {
    id
    nodeId
    menuItemByMenuItem {
      ...menuItemInfo
    }
  }
  ${menuItemFragment}
`;

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
    servingLocationByServingLocation {
      id
      name
    }
    accountByCreatedBy {
      ...accountInfo
    }
    orderItemsByOrder {
      nodes {
        ...orderItemInfo
      }
    }
  }
  ${accountFragment}
  ${orderItemFragment}
`;

const formatOrderItem = (orderItem = {}) => {
  const {
    menuItemByMenuItem: menuItem,
    ...rest
  } = orderItem;
  return Object.assign(
    {},
    rest,
    {menuItem: formatMenuItem(menuItem)}
  );
};

const formatOrder = (order = {}) => {
  const {
    accountByCreatedBy: orderer,
    orderItemsByOrder: {nodes = []},
    servingLocationByServingLocation: servingLocation,
    ...rest
  } = order;
  return Object.assign(
    {},
    rest,
    {
      servingLocation,
      orderer: formatAccount(orderer),
      items: nodes.map(node => formatOrderItem(node))
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
      const {orderById, ...getOrder} = data;
      return {
        restaurant: formatOrder(orderById),
        getOrder
      };
    }
  }
);

export {
  orderFragment,
  formatOrder,
  getOrder,
  orderItemFragment,
  formatOrderItem
};
