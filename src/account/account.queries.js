import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {
	restaurantFragment,
	formatRestaurant
} from 'restaurant/restaurant.queries';
import {
	formatAccount,
	accountFragment
} from 'account/account.fragments';

export const getActiveAccount = graphql(
	gql`
		query {
			getActiveAccount {
				...accountInfo
			}
		}
		${accountFragment}
	`,
	{
		props: ({ownProps, data: {getActiveAccount: account, ...getActiveAccount}}) => {
			return {
				account: formatAccount(account),
				getActiveAccount
			};
		}
	}
);

export const getRestaurantsByAccount = graphql(
	gql`
		query accountById($id: Int!) {
			accountById(id: $id) {
				restaurantAccountsByAccount {
					edges {
						node {
							restaurantByRestaurant {
								...restaurantInfo
							}
						}
					}
				}
			}
		}
		${restaurantFragment}
	`, {
		skip: ownProps =>
			typeof ownProps.account === 'object' && !get(['account', 'id'])(ownProps),
		options: ownProps => ({
			variables: {
				id: typeof ownProps.account === 'object' && ownProps.account ?
					ownProps.account.id : ownProps.account
			}
		}),
		props: ({ownProps, data}) => {
			const {accountById, ...getRestaurantsByAccount} = data;
			return {
				restaurants: (get(['restaurantAccountsByAccount', 'edges'])(accountById) || [])
					.map(edge => formatRestaurant(get(['node', 'restaurantByRestaurant'])(edge))),
				getRestaurantsByAccount
			};
		}
	}
);

export const getAccountsByRestaurant = graphql(
	gql`
		query accountsByRestaurant($id: Int!) {
			restaurantById(id: $id) {
				id
				restaurantAccountsByRestaurant {
					edges {
						node {
							accountRoleByRole {
								id
								name
							}
							accountByAccount {
								...accountInfo
							}
						}
					}
				}
			}
		}
		${accountFragment}
	`, {
		skip: ownProps =>
			!ownProps.restaurant,
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...getAccountsByRestaurant} = data;
			return {
				accounts: (get(['restaurantAccountsByRestaurant', 'edges'])(restaurantById) || [])
					.map(edge => {
						const {accountRoleByRole, accountByAccount} = edge.node;
						return {
							role: accountRoleByRole,
							account: formatAccount(accountByAccount
						)};
					}),
				getAccountsByRestaurant
			};
		}
	}
);

export const getAccountRolesForRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
				id
				accountRolesForRestaurant {
					edges {
						node {
							id
							nodeId
							name
							description
						}
					}
				}
			}
		}
	`, {
		skip: ownProps =>
			!ownProps.restaurant,
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...getAccountRolesForRestaurant} = data;
			return {
				roles: (get(['accountRolesForRestaurant', 'edges'])(restaurantById) || [])
					.map(edge => edge.node),
				getAccountRolesForRestaurant
			};
		}
	}
);
