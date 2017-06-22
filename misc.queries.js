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
  getCurrencies,
  currencyFragment
};
