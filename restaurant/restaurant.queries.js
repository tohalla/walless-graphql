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
import {
  servingLocationFragment,
  formatServingLocation
} from 'walless-graphql/restaurant/servingLocation.queries';
import {imageFragment} from 'walless-graphql/file.queries';
import {
  accountFragment,
  formatAccount
} from 'walless-graphql/account/account.fragments';

const restaurantFragment = gql`
	fragment restaurantInfo on Restaurant {
		id
    nodeId
		createdBy
    restaurantImagesByRestaurant {
      nodes {
        imageByImage {
          ...imageInfo
        }
      }
    }
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
  ${imageFragment}
`;

const formatRestaurant = (restaurant = {}) => {
  const {
    restaurantInformationsByRestaurant = {},
    currencyByCurrency: currency,
    restaurantImagesByRestaurant = {},
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
  const images = Array.isArray(restaurantImagesByRestaurant.nodes) ?
    restaurantImagesByRestaurant.nodes.map(node => node.imageByImage) : [];
  return Object.assign(
    {},
    rest,
    {
      information,
      currency,
      images
    }
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
			const {restaurantById, ...getRestaurant} = data;
			return {
				restaurant: formatRestaurant(restaurantById),
        getRestaurant
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
      const {restaurantById, ...getMenuItemsByRestaurant} = data;
      return {
        menuItems: (get(['menuItemsByRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => formatMenuItem(edge.node)),
        getMenuItemsByRestaurant
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
      const {restaurantById, ...getOrdersByRestaurant} = data;
      return {
        orders: (get(['ordersByRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => formatOrder(edge.node)),
        getOrdersByRestaurant
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
                ...accountInfo
							}
						}
					}
				}
			}
		}
    ${accountFragment}
	`, {
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
			const {restaurantById, ...getAccountRolesForRestaurant} = data;
			return {
        roles: (get(['accountRolesForRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => edge.node),
				getAccountRolesForRestaurant
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
			const {restaurantById, ...getMenusByRestaurant} = data;
			return {
        menus: (get(['menusByRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => formatMenu(edge.node)),
				getMenusByRestaurant
      };
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
			const {restaurantById, ...getServingLocationsByRestaurant} = data;
			return {
        servingLocations: (get(['servingLocationsByRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => formatServingLocation(edge.node)),
				getServingLocationsByRestaurant
      };
		}
	}
);

const getImagesForRestaurant = graphql(
	gql`
		query restaurantById($id: Int!) {
			restaurantById(id: $id) {
				nodeId
				imagesForRestaurant {
					edges {
						node {
							...imageInfo
						}
					}
				}
			}
		}
		${imageFragment}
	`, {
		options: ownProps => ({
			variables: {
				id: typeof ownProps.restaurant === 'object' ?
					ownProps.restaurant.id : ownProps.restaurant
			}
		}),
		props: ({ownProps, data}) => {
			const {restaurantById, ...getImagesForRestaurant} = data;
			return {
        images: (get(['imagesForRestaurant', 'edges'])(restaurantById) || [])
          .map(edge => edge.node),
				getImagesForRestaurant
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
	getImagesForRestaurant,
  formatRestaurant,
  getOrdersByRestaurant
};
