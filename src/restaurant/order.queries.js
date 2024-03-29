import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {accountFragment, formatAccount} from '../account/account.fragments';
import {menuItemFragment, formatMenuItem} from './menuItem.queries';

export const orderItemFragment = gql`
  fragment orderItemInfo on OrderItem {
    id
    menuItemByMenuItem {
      ...menuItemInfo
    }
  }
  ${menuItemFragment}
`;

export const orderFragment = gql`
  fragment orderInfo on Order {
    id
    createdAt
    completed
    updatedAt
    accepted
    declined
    paid
    message
    servingLocation
    servingLocationByServingLocation {
      id
      name
    }
    restaurant
    createdBy
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

export const formatOrderItem = (orderItem = {}) => {
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

export const formatOrder = (order = {}) => {
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

export const getOrder = graphql(
  gql`
    query orderById($id: Int!) {
      orderById(id: $id) {
        ...orderInfo
      }
    }
    ${orderFragment}
  `, {
    skip: ownProps => !ownProps.order,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.order === 'number' ?
          ownProps.order : get(['order', 'id'])(ownProps)
      }
    }),
    props: ({ownProps, data}) => {
      const {orderById, ...getOrder} = data;
      return {
        order: getOrder.loading ? ownProps.order : formatOrder(orderById),
        getOrder
      };
    }
  }
);

export const getOrdersByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        id
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
    skip: ownProps => !ownProps.restaurant,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'object' ?
          ownProps.restaurant.id : ownProps.restaurant
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...getOrdersByRestaurant} = data;
      return {
        orders: getOrdersByRestaurant.loading ? [] :
          (get(['ordersByRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => formatOrder(edge.node)),
        getOrdersByRestaurant
      };
    }
  }
);


export const getOrdersByAccount = graphql(
  gql`
    query accountById($id: Int!) {
      accountById(id: $id) {
        id
        ordersByCreatedBy {
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
    skip: ownProps => !ownProps.account,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.account === 'object' ?
          ownProps.account.id : ownProps.account
      }
    }),
    props: ({ownProps, data}) => {
      const {accountById, ...getOrdersByAccount} = data;
      return {
        orders: getOrdersByAccount.loading ? [] :
          (get(['ordersByCreatedBy', 'edges'])(accountById) || [])
            .map(edge => formatOrder(edge.node)),
        getOrdersByAccount
      };
    }
  }
);
