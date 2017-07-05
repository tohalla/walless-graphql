// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit} from 'lodash/fp';

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
      createOrder: (order, items) => mutate({variables: {input: {order, items}}})
    })
  }
);

const createOrder = graphql(
  gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      order {
        ...orderInfo
      }
    }
  }
  ${orderFragment}
  `, {
    props: ({mutate}) => ({
      updateOrder: order => mutate({variables: {
        input: {order: omit(['__typename', 'nodeId'])(order)}
      }})
    })
  }
);

export {
  createOrder
};
