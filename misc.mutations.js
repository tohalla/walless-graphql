// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {pick} from 'lodash/fp';

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
      createAddress: address => mutate({variables: {
        input: {address: Object.assign(
          pick([
            'route',
            'streetNumber',
            'postalCode',
            'country',
            'coordinates',
            'locality',
            'placeId'
          ])(address),
          address.lat && address.lng ?
            {coordinates: `(${address.lat},${address.lng})`}
          : {}
        )}
      }})
    })
  }
);

export {
  createAddress
};
