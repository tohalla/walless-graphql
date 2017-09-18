import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {get} from 'lodash/fp';

export const optionFragment = gql`
  fragment optionInfo on Option {
    id
    optionI18nsByOption {
      nodes {
        nodeId
        language
        name
        description
      }
    }
  }
`;

export const formatOption = (option = {}) => {
  const {
    optionI18nsByOption,
    ...rest
  } = option;
  const i18n = Array.isArray(optionI18nsByOption.nodes) ?
    optionI18nsByOption.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign({}, rest, {i18n});
};

export const getOptions = graphql(
  gql`
    query allOptions {
      allOptions {
        nodes {
          ...optionInfo
        }
      }
    }
    ${optionFragment}
  `, {
    props: ({ownProps, data}) => {
      const {allOptions, ...getOptions} = data;
      return {
        options: getOptions.loading ? [] :
          (get(['nodes'])(allOptions) || [])
            .map(node => formatOption(node)),
        getOptions
      };
    }
  }
);
