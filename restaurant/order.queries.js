import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {accountFragment, formatAccount} from 'walless-graphql/account/account.fragments';
import {menuItemFragment, formatMenuItem} from 'walless-graphql/restaurant/menuItem.queries';
import {get} from 'lodash/fp';

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
    restaurant
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
    accountByCreatedBy: createdBy,
    orderItemsByOrder: {nodes = []},
    servingLocationByServingLocation: servingLocation,
    ...rest
  } = order;
  return Object.assign(
    {},
    rest,
    {
      servingLocation,
      createdBy: formatAccount(createdBy),
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

const getOrdersByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        nodeId
        ordersByRestaurant {
          edges {
            node {
              ...orderInfo
            }
          }
        }
      }
    }
    ${orderFragment}
  `, {
    skip: ownProps =>
      !ownProps.restaurant,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'object' ?
          ownProps.restaurant.id : ownProps.restaurant
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...getOrdersByRestaurant} = data;
      return {
        orders: (get(['ordersByRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => formatOrder(edge.node)),
        getOrdersByRestaurant
      };
    }
  }
);

export {
  orderFragment,
  formatOrder,
  getOrder,
  orderItemFragment,
  formatOrderItem,
  getOrdersByRestaurant
};
