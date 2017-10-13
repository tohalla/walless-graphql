import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit} from 'lodash/fp';

import {servingLocationFragment} from 'restaurant/servingLocation.queries';

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
