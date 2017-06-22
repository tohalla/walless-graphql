// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {orderFragment} from 'walless-graphql/restaurant/order.queries';

const createOrder = graphql(
  gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        ...orderInfo
      }
    }
  }
  ${orderFragment}
  `, {
    props: ({mutate}) => ({
      createOrder: order => mutate({variables: {input: {order}}})
    })
  }
);

const createOrderItem = graphql(
  gql`
  mutation createOrderItem($input: CreateOrderItemInput!) {
    createOrderItem(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      createOrderItem: (orderItem) => mutate({
        variables: {
          input: {orderItem}
        }
      })
    })
  }
);

export {
  createOrder,
  createOrderItem
};
