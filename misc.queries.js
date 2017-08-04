import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {get} from 'lodash/fp';

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
    locality
    placeId
  }
`;

const dietFragment = gql`
  fragment dietInfo on Diet {
    nodeId
    id
    color
    dietInformationsByDiet {
      nodes {
        language
        nodeId
        abbreviation
        name
        description
      }
    }
  }
`;

const formatDiet = (diet = {}) => {
  const {
    dietInformationsByDiet,
    ...rest
  } = diet;
  const information = Array.isArray(dietInformationsByDiet.nodes) ?
    dietInformationsByDiet.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign({}, rest, {information});
};

const getDiets = graphql(
  gql`
    query allDiets {
      allDiets {
        nodes {
          ...dietInfo
        }
      }
    }
    ${dietFragment}
  `, {
    props: ({ownProps, data}) => {
      const {allDiets, ...getDiets} = data;
      return {
        diets: (get(['nodes'])(allDiets) || [])
          .map(node => formatDiet(node)),
        getDiets
      };
    }
  }
);

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
  getDiets,
  formatDiet,
  currencyFragment
};
