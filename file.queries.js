import gql from 'graphql-tag';

const fileFragment = gql`
  fragment fileInfo on File {
    nodeId
    id
    uri
    key
  }
`;

const imageFragment = gql`
  fragment imageInfo on Image {
    nodeId
    id
    uri
    key
    thumbnail
  }
`;

export {fileFragment, imageFragment};
