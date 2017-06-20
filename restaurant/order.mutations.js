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

const serOrderItems = graphql(
  gql`
  mutation setOrderMenuItems($input: SetOrderMenuItemsInput!) {
    setOrderMenuItems(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      serOrderItems: (order: Number, orderItems: Number[]) => mutate({
        variables: {
          input: {order, orderItems}
        }
      })
    })
  }
);

export {
  createOrder,
  serOrderItems
};
