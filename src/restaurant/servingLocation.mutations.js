import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit, get} from 'lodash/fp';

import {servingLocationFragment} from './servingLocation.queries';

export const createServingLocation = graphql(
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

export const updateServingLocation = graphql(
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
      updateServingLocation: (servingLocation) => mutate({variables: {
        input: {servingLocation: omit(['__typename', 'nodeId'])(servingLocation)}
      }})
    })
  }
);

export const deleteServingLocation = graphql(
  gql`
  mutation deleteServingLocation($input: DeleteServingLocationInput!) {
    deleteServingLocation(input: $input) {
      clientMutationId
    }
  }
  `, {
    props: ({mutate}) => ({
      deleteServingLocation: servingLocation => mutate({variables: {
        input: {servingLocation: get('id')(servingLocation) || servingLocation}
      }})
    })
  }
);
