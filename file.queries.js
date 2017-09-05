import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

export const fileFragment = gql`
  fragment fileInfo on File {
    nodeId
    id
    uri
    key
  }
`;

export const imageFragment = gql`
  fragment imageInfo on Image {
    nodeId
    id
    uri
    key
    thumbnail
  }
`;

export const getImagesForRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        id
        imagesForRestaurant {
          edges {
            node {
              ...imageInfo
            }
          }
        }
      }
    }
    ${imageFragment}
  `, {
    skip: ownProps =>
      !ownProps.restaurant,
    options: ownProps => ({
      variables: {
        id: typeof ownProps.restaurant === 'object' ?
          ownProps.restaurant.id : ownProps.restaurant
      }
    }),
    props: ({ownProps, data}) => {
      const {restaurantById, ...getImagesForRestaurant} = data;
      return {
        images: (get(['imagesForRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => edge.node),
        getImagesForRestaurant
      };
    }
  }
);
