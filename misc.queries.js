import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const currencyFragment = gql`
  fragment currencyInfo on Currency {
    nodeId
    code
    name
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
      const {allCurrencies = {}, ...rest} = data;
      return {getCurrencies: {
        currencies: allCurrencies.nodes,
        data: rest
      }};
    }
  }
);

export {
  getCurrencies,
  currencyFragment
};
