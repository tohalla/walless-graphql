import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const currencyFragment = gql`
  fragment currencyInfo on Currency {
    nodeId
    code
    name
    symbol
    zeroDecimal
  }
`;

const addressFragment = gql`
  fragment addressInfo on Address {
    nodeId
    id
    route
    streetNumber
    postalCode
    country
    coordinates
  }
`;

const dietFragment = gql`
  fragment dietInfo on Diet {
    nodeId
    id
    name
    description
  }
`;

const getCurrencies = graphql(
  gql`
    query allCurrencies {
      allCurrencies {
        nodes {
          ...currencyInfo
        }
      }
    }
    ${currencyFragment}
  `, {
    props: ({ownProps, data}) => {
      const {allCurrencies = {}, ...getCurrencies} = data;
      return {
        currencies: allCurrencies.nodes,
        getCurrencies
      };
    }
  }
);

export {
  addressFragment,
  getCurrencies,
  dietFragment,
  currencyFragment
};
