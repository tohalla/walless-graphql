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
        ...currencyInfo
      }
    }
    ${currencyFragment}
  `, {
    props: ({ownProps, data}) => {
      const {allCurrencies: currencies, ...rest} = data;
      return {getCurrencies: {
        currencies,
        data: rest
      }};
    }
  }
);

export {
  getCurrencies,
  currencyFragment
};
