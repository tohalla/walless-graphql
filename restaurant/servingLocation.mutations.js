// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit} from 'lodash/fp';

import {
  servingLocationFragment
} from 'walless-graphql/restaurant/servingLocation.queries';

const createServingLocation = graphql(
  gql`
  mutation createServingLocation($input: CreateServingLocationInput!) {
    createServingLocation(input: $input) {
      servingLocation {
        ...servingLocationInfo
      }
    }
  }
  ${servingLocationFragment}
  `, {
    props: ({mutate, data}) => ({
      createServingLocation: servingLocation => mutate({
        variables: {input: {servingLocation}}
      })
    })
  }
);

const updateServingLocation = graphql(
  gql`
  mutation updateServingLocation($input: UpdateServingLocationInput!) {
    updateServingLocation(input: $input) {
      servingLocation {
        ...servingLocationInfo
      }
    }
  }
  ${servingLocationFragment}
  `, {
    props: ({mutate}) => ({
      updateServingLocation: (servingLocation: {id: Number}) => mutate({variables: {
        input: {servingLocation: omit(['__typename', 'nodeId'])(servingLocation)}
      }})
    })
  }
);


export {
  createServingLocation,
  updateServingLocation
};
