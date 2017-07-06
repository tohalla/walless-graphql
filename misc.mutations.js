// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {addressFragment} from 'walless-graphql/misc.queries';

const createAddress = graphql(
  gql`
  mutation createAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      address {
        ...addressInfo
      }
    }
  }
  ${addressFragment}
  `, {
    props: ({mutate}) => ({
      createAddress: address => mutate({variables: {input: {address}}})
    })
  }
);

export {
  createAddress
};
