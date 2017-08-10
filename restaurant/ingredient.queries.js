import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {get} from 'lodash/fp';

const ingredientFragment = gql`
  fragment ingredientInfo on Ingredient {
    nodeId
    id
    ingredientI18nsByIngredient {
      nodes {
        language
        nodeId
        name
        description
      }
    }
  }
`;

const formatIngredient = (ingredient = {}) => {
  const {
    ingredientI18nsByIngredient,
    ...rest
  } = ingredient;
  const i18n = Array.isArray(ingredientI18nsByIngredient.nodes) ?
    ingredientI18nsByIngredient.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign({}, rest, {i18n});
};

const getIngredients = graphql(
  gql`
    query allIngredients {
      allIngredients {
        nodes {
          ...ingredientInfo
        }
      }
    }
    ${ingredientFragment}
  `, {
    props: ({ownProps, data}) => {
      const {allIngredients, ...getIngredients} = data;
      return {
        ingredients: (get(['nodes'])(allIngredients) || [])
          .map(node => formatIngredient(node)),
        getIngredients
      };
    }
  }
);

export {
  formatIngredient,
  ingredientFragment,
  getIngredients
};
