import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

export const currencyFragment = gql`
  fragment currencyInfo on Currency {
    nodeId
    code
    name
    symbol
    zeroDecimal
  }
`;

export const addressFragment = gql`
  fragment addressInfo on Address {
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

export const dietFragment = gql`
  fragment dietInfo on Diet {
    id
    color
    dietI18nsByDiet {
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

export const formatDiet = (diet = {}) => {
  const {
    dietI18nsByDiet,
    ...rest
  } = diet;
  const i18n = Array.isArray(dietI18nsByDiet.nodes) ?
    dietI18nsByDiet.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign({}, rest, {i18n});
};

export const getDiets = graphql(
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

export const getCurrencies = graphql(
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
