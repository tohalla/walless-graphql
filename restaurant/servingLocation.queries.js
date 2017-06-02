import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const servingLocationFragment = gql`
  fragment servingLocationInfo on ServingLocation {
    id
    name
    enabled
    createdAt
  }
`;

const getServingLocation = graphql(
  gql`
    query servingLocationById($id: Int!) {
      servingLocationById(id: $id) {
        ...servingLocationInfo
      }
    }
    ${servingLocationFragment}
  `, {
    skip: ownProps => typeof ownProps.servingLocation !== 'number',
    options: ownProps => ({
      variables: {
        id: ownProps.servingLocation
      }
    }),
    props: ({ownProps, data}) => {
      const {servingLocationById, ...rest} = data;
      return {getServingLocation: {
        servingLocation: servingLocationById,
        data: rest
      }};
    }
  }
);

export {
  servingLocationFragment,
  getServingLocation
};
