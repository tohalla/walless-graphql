import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {pick} from 'lodash/fp';

import {orderFragment} from 'restaurant/order.queries';

export const createOrder = graphql(
	gql`
	mutation createOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			order {
				...orderInfo
			}
		}
	}
	${orderFragment}
	`, {
		props: ({mutate}) => ({
			createOrder: (order, items) => mutate({
				variables: {
					input: {
						order,
						items
					}
				}
			})
		})
	}
);

export const updateOrder = graphql(
	gql`
	mutation updateOrder($input: UpdateOrderInput!) {
		updateOrder(input: $input) {
			order {
				...orderInfo
			}
		}
	}
	${orderFragment}
	`, {
		props: ({mutate}) => ({
			updateOrder: order => mutate({variables: {
				input: {
					order: Object.assign(
						pick([
							'id',
							'accepted',
							'declined',
							'completed'
						])(order),
						{
							restaurant: typeof order.restaurant === 'object' ?
								order.restaurant.id : order.restaurant,
							servingLocation: typeof order.servingLocation === 'object' ?
								order.servingLocation.id : order.servingLocation,
							createdBy: typeof order.createdBy === 'object' ?
								order.createdBy.id : order.restaurant
						}
					)
				}
			}})
		})
	}
);
