// @flow
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {servingLocationFragment} from 'walless-graphql/servingLocation.queries';

const createServingLocation = graphql(
  gql`
  mutation createServingLocation($servingLocation: CreateServingLocationInput!) {
    createServingLocation(input: $servingLocation) {
      servingLocation {
        ...servingLocationInfo
      }
    }
  }
  ${servingLocationFragment}
  `, {
    props: ({mutate, data}) => ({
      createServingLocation: servingLocation => mutate({
        variables: {servingLocation: {servingLocation}}
      })
    })
  }
);

const updateServingLocation = graphql(
  gql`
  mutation updateServingLocationById($input: UpdateServingLocationByIdInput!) {
    updateServingLocationById(input: $input) {
      servingLocation {
        ...servingLocationInfo
      }
    }
  }
  ${servingLocationFragment}
  `, {
    props: ({mutate}) => ({
      updateServingLocation: (servingLocation: {id: Number}) => mutate({
        variables: {
          input: {
            id: servingLocation.id,
            servingLocationPatch: servingLocation
          }
        }
      })
    })
  }
);


export {
  createServingLocation,
  updateServingLocation
};
