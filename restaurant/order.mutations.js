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

const createOrderMenuItem = graphql(
  gql`
  mutation createOrderMenuItem($input: CreateOrderMenuItemInput!) {
    createOrderMenuItem(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      createOrderMenuItem: (orderMenuItem) => mutate({
        variables: {
          input: {orderMenuItem}
        }
      })
    })
  }
);

export {
  createOrder,
  createOrderMenuItem
};
