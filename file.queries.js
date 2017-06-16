import gql from 'graphql-tag';

const fileFragment = gql`
  fragment fileInfo on File {
    nodeId
    id
    uri
    key
  }
`;

export {fileFragment};
