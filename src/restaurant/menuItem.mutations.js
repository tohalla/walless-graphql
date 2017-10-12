import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {omit, get} from 'lodash/fp';

import {menuItemFragment} from 'restaurant/menuItem.queries';

export const createMenuItem = graphql(
	gql`
	mutation createMenuItem($menuItem: CreateMenuItemInput!) {
		createMenuItem(input: $menuItem) {
			menuItem {
				...menuItemInfo
			}
		}
	}
	${menuItemFragment}
	`, {
		props: ({mutate, data}) => ({
			createMenuItem: menuItem => mutate({
				variables: {menuItem: {menuItem}}
			})
		})
	}
);

export const updateMenuItem = graphql(
	gql`
	mutation updateMenuItem($input: UpdateMenuItemInput!) {
		updateMenuItem(input: $input) {
			menuItem {
				...menuItemInfo
			}
		}
	}
	${menuItemFragment}
	`, {
		props: ({mutate}) => ({
			updateMenuItem: (menuItem) => mutate({variables: {
				input: {menuItem: omit(['__typename', 'nodeId'])(menuItem)}
			}})
		})
	}
);

export const deleteMenuItem = graphql(
	gql`
	mutation deleteMenuItem($input: DeleteMenuItemInput!) {
		deleteMenuItem(input: $input) {
			clientMutationId
		}
	}
	`, {
		props: ({mutate}) => ({
			deleteMenuItem: menuItem => mutate({variables: {
				input: {menuItem: get('id')(menuItem) || menuItem}
			}})
		})
	}
);


export const createMenuItemI18n = graphql(
	gql`
	mutation createMenuItemI18n($input: CreateMenuItemI18nInput!) {
		createMenuItemI18n(input: $input) {
			clientMutationId
		}
	}
	`, {
		props: ({mutate}) => ({
			createMenuItemI18n: (menuItemI18nItems) => {
				(Array.isArray(menuItemI18nItems) ? menuItemI18nItems : [menuItemI18nItems])
					.forEach(menuItemI18n =>
						mutate({
							variables: {
								input: {menuItemI18n}
							}
						})
					);
			}
		})
	}
);

export const updateMenuItemI18n = graphql(
	gql`
	mutation updateMenuItemI18n($input: UpdateMenuItemI18nInput!) {
		updateMenuItemI18n(input: $input) {
			clientMutationId
		}
	}
	`, {
		props: ({mutate}) => ({
			updateMenuItemI18n: (menuItemI18nItems) =>
				(Array.isArray(menuItemI18nItems) ? menuItemI18nItems : [menuItemI18nItems])
					.forEach(menuItemI18n =>
						mutate({variables: {
							input: {
								menuItemI18n: omit(['__typename', 'nodeId'])(menuItemI18n)
							}
						}})
					)
		})
	}
);

export const updateMenuItemImages = graphql(
	gql`
	mutation updateMenuItemImages($input: UpdateMenuItemImagesInput!) {
		updateMenuItemImages(input: $input) {
			clientMutationId
		}
	}
	`, {
		props: ({mutate}) => ({
			updateMenuItemImages: (menuItem, images) => mutate({
				variables: {
					input: {menuItem, images}
				}
			})
		})
	}
);

export const updateMenuItemDiets = graphql(
	gql`
	mutation updateMenuItemDiets($input: UpdateMenuItemDietsInput!) {
		updateMenuItemDiets(input: $input) {
			clientMutationId
		}
	}
	`, {
		props: ({mutate}) => ({
			updateMenuItemDiets: (menuItem, diets) => mutate({
				variables: {
					input: {menuItem, diets}
				}
			})
		})
	}
);

export const updateMenuItemOptions = graphql(
	gql`
	mutation updateMenuItemOptions($input: UpdateMenuItemOptionsInput!) {
		updateMenuItemOptions(input: $input) {
			clientMutationId
		}
	}
	`, {
		props: ({mutate}) => ({
			updateMenuItemOptions: (menuItem, menuItemOptions) => mutate({
				variables: {
					input: {
						menuItem,
						menuItemOptions: menuItemOptions.map(
							({menuItem, id, option, defaultValue}) => ({
								option: id || option,
								defaultValue,
								menuItem
							})
						)
					}
				}
			})
		})
	}
);

