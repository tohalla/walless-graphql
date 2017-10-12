import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit} from 'lodash/fp';

import {accountFragment} from 'account/account.fragments';

export const updateAccount = graphql(
	gql`
	mutation updateAccount($input: UpdateAccountInput!) {
		updateAccount(input: $input) {
			account {
				...accountInfo
			}
		}
	}
	${accountFragment}
	`, {
		props: ({mutate}) => ({
			updateAccount: account => mutate({variables: {
				input: {account: omit(['__typename', 'nodeId'])(account)}
			}})
		})
	}
);
