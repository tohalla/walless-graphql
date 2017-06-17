import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {hasIn} from 'lodash/fp';

import {
	formatMenuItem,
	menuItemFragment
} from 'walless-graphql/restaurant/menuItem.queries';
import {
	formatMenu,
	menuFragment
} from 'walless-graphql/restaurant/menu.queries';
import {currencyFragment} from 'walless-graphql/misc.queries';
import {servingLocationFragment} from 'walless-graphql/restaurant/servingLocation.queries';
import {fileFragment} from 'walless-graphql/file.queries';

const restaurantFragment = gql`
	fragment restaurantInfo on Restaurant {
		id
    nodeId
		createdBy
    currencyByCurrency {
      ...currencyInfo
    }
    restaurantInformationsByRestaurant {
      nodes {
        language
        name
        description
      }
    }
	}
  ${currencyFragment}
`;

const formatRestaurant = (restaurant = {}) => {
  const {
    restaurantInformationsByRestaurant = {},
    currencyByCurrency: currency,
    ...rest
  } = restaurant;
  const information = Array.isArray(restaurantInformationsByRestaurant.nodes) ?
    restaurantInformationsByRestaurant.nodes.reduce(
      (prev, val) => {
        const {language, ...restInformation} = val;
        return Object.assign({}, prev, {[language]: restInformation});
      },
      {}
    ) : [];
  return Object.assign(
    {},
    rest,
    {information, currency}
  );
};

const getRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
				...restaurantInfo
			}
		}
		${restaurantFragment}
	`, {
		skip: ownProps =>
			typeof ownProps.restaurant !== 'number',
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'number' ? ownProps.restaurant : null
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...rest} = data;
			return {
				getRestaurant: {
          restaurant: formatRestaurant(restaurantById),
          data: rest
        }
			};
		}
	}
);

const getMenuItemsByRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
        nodeId
				menuItemsByRestaurant {
					edges {
						node {
							...menuItemInfo
						}
					}
				}
			}
		}
		${menuItemFragment}
	`, {
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...rest} = data;
			if (!hasIn(
				[
					'menuItemsByRestaurant',
					'edges'
				])(restaurantById)
			) {
				return {data: rest};
			}
			return {
				getMenuItemsByRestaurant: {
					menuItems: restaurantById.menuItemsByRestaurant.edges
						.map(edge => formatMenuItem(edge.node)),
					data: rest
				}
			};
		}
	}
);

const getAccountsByRestaurant = graphql(
	gql`
		query accountsByRestaurant($id: Int!) {
			restaurantById(id: $id) {
				nodeId
				restaurantAccountsByRestaurant {
					edges {
						node {
							accountRoleByRole {
                nodeId
								name
							}
							accountByAccount {
								id
                nodeId
								firstName
								lastName
							}
						}
					}
				}
			}
		}
	`, {
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...rest} = data;
			return {
				getAccountsByRestaurant: {
					accounts: hasIn(['restaurantAccountsByRestaurant', 'edges'])(restaurantById) ?
						restaurantById.restaurantAccountsByRestaurant.edges
							.map(edge => formatMenuItem(edge.node)) : [],
					data: rest
				}
			};
		}
	}
);

const getAccountRolesForRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
				nodeId
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
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...rest} = data;
			return {
				getAccountRolesForRestaurant: {
					roles: hasIn(['accountRolesForRestaurant', 'edges'])(restaurantById) ?
						restaurantById.accountRolesForRestaurant.edges.map(edge => edge.node) : [],
					data: rest
				}
			};
		}
	}
);

const getMenusByRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
				nodeId
				menusByRestaurant {
					edges {
						node {
							...menuInfo
						}
					}
				}
			}
		}
		${menuFragment}
	`, {
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...rest} = data;
			if (!hasIn(
				[
					'menusByRestaurant',
					'edges'
				])(restaurantById)
			) {
				return {data: rest};
			}
			return {getMenusByRestaurant: {
				menus: restaurantById.menusByRestaurant.edges
					.map(edge => formatMenu(edge.node)),
				data: rest
			}};
		}
	}
);

const getServingLocationsByRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
				nodeId
				servingLocationsByRestaurant {
					edges {
						node {
							...servingLocationInfo
						}
					}
				}
			}
		}
		${servingLocationFragment}
	`, {
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...rest} = data;
			if (!hasIn(
				[
					'servingLocationsByRestaurant',
					'edges'
				])(restaurantById)
			) {
				return {data: rest};
			}
			return {getServingLocationsByRestaurant: {
				servingLocations: restaurantById.servingLocationsByRestaurant.edges
					.map(edge => edge.node),
				data: rest
			}};
		}
	}
);

const getFilesForRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
				nodeId
				filesForRestaurant {
					edges {
						node {
							...fileInfo
						}
					}
				}
			}
		}
		${fileFragment}
	`, {
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...rest} = data;
			return {
				getFilesForRestaurant: {
					files: hasIn([
						'filesForRestaurant',
						'edges']
					)(restaurantById) ?
						restaurantById.filesForRestaurant.edges.map(edge => edge.node) : [],
					data: rest
				}
			};
		}
	}
);


export {
	restaurantFragment,
	getRestaurant,
	getMenuItemsByRestaurant,
	getAccountsByRestaurant,
	getMenusByRestaurant,
	getAccountRolesForRestaurant,
	getServingLocationsByRestaurant,
	getFilesForRestaurant,
  formatRestaurant
};
