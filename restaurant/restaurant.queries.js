import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {get} from 'lodash/fp';

import {
	formatMenuItem,
	menuItemFragment
} from 'walless-graphql/restaurant/menuItem.queries';
import {
	formatMenu,
	menuFragment
} from 'walless-graphql/restaurant/menu.queries';
import {currencyFragment} from 'walless-graphql/misc.queries';
import {
  formatOrder,
  orderFragment
} from 'walless-graphql/restaurant/order.queries';
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
      return {
        getMenuItemsByRestaurant: {
          menuItems: (get(['menuItemsByRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => formatMenuItem(edge.node)),
          data: rest
        }
      };
    }
  }
);

const getOrdersByRestaurant = graphql(
  gql`
    query restaurantById($id: Int!) {
      restaurantById(id: $id) {
        nodeId
        ordersByRestaurant {
          edges {
            node {
              ...orderInfo
            }
          }
        }
      }
    }
    ${orderFragment}
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
        getOrdersByRestaurant: {
          orders: (get(['ordersByRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => formatOrder(edge.node)),
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
          accounts: (get(['restaurantAccountsByRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => edge.node),
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
          roles: (get(['accountRolesForRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => edge.node),
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
			return {getMenusByRestaurant: {
        menus: (get(['menusByRestaurant', 'edges'])(restaurantById) || [])
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
			return {getServingLocationsByRestaurant: {
        servingLocations: (get(['servingLocationsByRestaurant', 'edges'])(restaurantById) || [])
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
          files: (get(['filesForRestaurant', 'edges'])(restaurantById) || [])
            .map(edge => edge.node),
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
  formatRestaurant,
  getOrdersByRestaurant
};
