import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { find, get, omit, pick, set } from 'lodash/fp';
import { camelizeKeys, pascalize } from 'humps';

var _templateObject = _taggedTemplateLiteral(['\n  fragment currencyInfo on Currency {\n    nodeId\n    code\n    name\n    symbol\n    zeroDecimal\n  }\n'], ['\n  fragment currencyInfo on Currency {\n    nodeId\n    code\n    name\n    symbol\n    zeroDecimal\n  }\n']);
var _templateObject2 = _taggedTemplateLiteral(['\n  fragment addressInfo on Address {\n    id\n    route\n    streetNumber\n    postalCode\n    country\n    coordinates\n    locality\n    placeId\n  }\n'], ['\n  fragment addressInfo on Address {\n    id\n    route\n    streetNumber\n    postalCode\n    country\n    coordinates\n    locality\n    placeId\n  }\n']);
var _templateObject3 = _taggedTemplateLiteral(['\n  fragment dietInfo on Diet {\n    id\n    color\n    dietI18nsByDiet {\n      nodes {\n        language\n        nodeId\n        abbreviation\n        name\n        description\n      }\n    }\n  }\n'], ['\n  fragment dietInfo on Diet {\n    id\n    color\n    dietI18nsByDiet {\n      nodes {\n        language\n        nodeId\n        abbreviation\n        name\n        description\n      }\n    }\n  }\n']);
var _templateObject4 = _taggedTemplateLiteral(['\n    query allDiets {\n      allDiets {\n        nodes {\n          ...dietInfo\n        }\n      }\n    }\n    ', '\n  '], ['\n    query allDiets {\n      allDiets {\n        nodes {\n          ...dietInfo\n        }\n      }\n    }\n    ', '\n  ']);
var _templateObject5 = _taggedTemplateLiteral(['\n    query allCurrencies {\n      allCurrencies {\n        nodes {\n          ...currencyInfo\n        }\n      }\n    }\n    ', '\n  '], ['\n    query allCurrencies {\n      allCurrencies {\n        nodes {\n          ...currencyInfo\n        }\n      }\n    }\n    ', '\n  ']);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var currencyFragment = gql(_templateObject);

var addressFragment = gql(_templateObject2);

var dietFragment = gql(_templateObject3);

var formatDiet = function formatDiet() {
  var diet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var dietI18nsByDiet = diet.dietI18nsByDiet,
      rest = _objectWithoutProperties(diet, ['dietI18nsByDiet']);

  var i18n = Array.isArray(dietI18nsByDiet.nodes) ? dietI18nsByDiet.nodes.reduce(function (prev, val) {
    var language = val.language,
        restInformation = _objectWithoutProperties(val, ['language']);

    return Object.assign({}, prev, _defineProperty({}, language, restInformation));
  }, {}) : [];
  return Object.assign({}, rest, { i18n: i18n });
};

var getDiets = graphql(gql(_templateObject4, dietFragment), {
  props: function props(_ref) {
    var ownProps = _ref.ownProps,
        data = _ref.data;

    var allDiets = data.allDiets,
        getDiets = _objectWithoutProperties(data, ['allDiets']);

    return {
      diets: (get(['nodes'])(allDiets) || []).map(function (node) {
        return formatDiet(node);
      }),
      getDiets: getDiets
    };
  }
});

var getCurrencies = graphql(gql(_templateObject5, currencyFragment), {
  props: function props(_ref2) {
    var ownProps = _ref2.ownProps,
        data = _ref2.data;

    var _data$allCurrencies = data.allCurrencies,
        allCurrencies = _data$allCurrencies === undefined ? {} : _data$allCurrencies,
        getCurrencies = _objectWithoutProperties(data, ['allCurrencies']);

    return {
      currencies: allCurrencies.nodes,
      getCurrencies: getCurrencies
    };
  }
});


var miscQueries = Object.freeze({
	currencyFragment: currencyFragment,
	addressFragment: addressFragment,
	dietFragment: dietFragment,
	formatDiet: formatDiet,
	getDiets: getDiets,
	getCurrencies: getCurrencies
});

var _templateObject$1 = _taggedTemplateLiteral$1(['\n\tmutation createAddress($input: CreateAddressInput!) {\n\t\tcreateAddress(input: $input) {\n\t\t\taddress {\n\t\t\t\t...addressInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation createAddress($input: CreateAddressInput!) {\n\t\tcreateAddress(input: $input) {\n\t\t\taddress {\n\t\t\t\t...addressInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);

function _taggedTemplateLiteral$1(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var createAddress = graphql(gql(_templateObject$1, addressFragment), {
	props: function props(_ref) {
		var mutate = _ref.mutate;
		return {
			createAddress: function createAddress(address) {
				return mutate({ variables: {
						input: { address: Object.assign(pick(['route', 'streetNumber', 'postalCode', 'country', 'coordinates', 'locality', 'placeId'])(address), address.lat && address.lng ? { coordinates: '(' + address.lat + ',' + address.lng + ')' } : {}) }
					} });
			}
		};
	}
});

var miscMutations = Object.freeze({
	createAddress: createAddress
});

var _templateObject$2 = _taggedTemplateLiteral$2(['\n  fragment accountInfo on Account {\n    id\n    firstName\n    lastName\n    language\n    email\n  }\n'], ['\n  fragment accountInfo on Account {\n    id\n    firstName\n    lastName\n    language\n    email\n  }\n']);
var _templateObject2$1 = _taggedTemplateLiteral$2(['\n  fragment roleRightsInfo on RestaurantRoleRight {\n    id\n    allowAddPromotion\n    allowAlterPromotion\n    allowDeletePromotion\n    allowAddMenu\n    allowAlterMenu\n    allowDeleteMenu\n    allowAddMenuItem\n    allowAlterMenuItem\n    allowDeleteMenuItem\n    allowChangeRestaurantDescription\n    allowChangeRestaurantDescription\n    allowAlterRestaurantRoles\n    allowMapRoles\n  }\n'], ['\n  fragment roleRightsInfo on RestaurantRoleRight {\n    id\n    allowAddPromotion\n    allowAlterPromotion\n    allowDeletePromotion\n    allowAddMenu\n    allowAlterMenu\n    allowDeleteMenu\n    allowAddMenuItem\n    allowAlterMenuItem\n    allowDeleteMenuItem\n    allowChangeRestaurantDescription\n    allowChangeRestaurantDescription\n    allowAlterRestaurantRoles\n    allowMapRoles\n  }\n']);

function _taggedTemplateLiteral$2(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var formatAccount = function formatAccount() {
  var account = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return account;
};

var accountFragment = gql(_templateObject$2);

var roleRightsFragment = gql(_templateObject2$1);



var accountFragments = Object.freeze({
	accountFragment: accountFragment,
	formatAccount: formatAccount,
	roleRightsFragment: roleRightsFragment
});

var _templateObject$3 = _taggedTemplateLiteral$3(['\n\tmutation updateAccount($input: UpdateAccountInput!) {\n\t\tupdateAccount(input: $input) {\n\t\t\taccount {\n\t\t\t\t...accountInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation updateAccount($input: UpdateAccountInput!) {\n\t\tupdateAccount(input: $input) {\n\t\t\taccount {\n\t\t\t\t...accountInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);

function _taggedTemplateLiteral$3(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var updateAccount = graphql(gql(_templateObject$3, accountFragment), {
	props: function props(_ref) {
		var mutate = _ref.mutate;
		return {
			updateAccount: function updateAccount(account) {
				return mutate({ variables: {
						input: { account: omit(['__typename', 'nodeId'])(account) }
					} });
			}
		};
	}
});

var accountMutations = Object.freeze({
	updateAccount: updateAccount
});

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject$6 = _taggedTemplateLiteral$6(['\n  fragment fileInfo on File {\n    id\n    uri\n    key\n  }\n'], ['\n  fragment fileInfo on File {\n    id\n    uri\n    key\n  }\n']);
var _templateObject2$4 = _taggedTemplateLiteral$6(['\n  fragment imageInfo on Image {\n    id\n    uri\n    key\n  }\n'], ['\n  fragment imageInfo on Image {\n    id\n    uri\n    key\n  }\n']);
var _templateObject3$3 = _taggedTemplateLiteral$6(['\n    query restaurantById($id: Int!) {\n      restaurantById(id: $id) {\n        id\n        imagesForRestaurant {\n          edges {\n            node {\n              ...imageInfo\n            }\n          }\n        }\n      }\n    }\n    ', '\n  '], ['\n    query restaurantById($id: Int!) {\n      restaurantById(id: $id) {\n        id\n        imagesForRestaurant {\n          edges {\n            node {\n              ...imageInfo\n            }\n          }\n        }\n      }\n    }\n    ', '\n  ']);

function _objectWithoutProperties$3(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$6(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fileFragment = gql(_templateObject$6);

var imageFragment = gql(_templateObject2$4);

var getImagesForRestaurant = graphql(gql(_templateObject3$3, imageFragment), {
  skip: function skip(ownProps) {
    return !ownProps.restaurant;
  },
  options: function options(ownProps) {
    return {
      variables: {
        id: _typeof$1(ownProps.restaurant) === 'object' ? ownProps.restaurant.id : ownProps.restaurant
      }
    };
  },
  props: function props(_ref) {
    var ownProps = _ref.ownProps,
        data = _ref.data;

    var restaurantById = data.restaurantById,
        getImagesForRestaurant = _objectWithoutProperties$3(data, ['restaurantById']);

    return {
      images: (get(['imagesForRestaurant', 'edges'])(restaurantById) || []).map(function (edge) {
        return edge.node;
      }),
      getImagesForRestaurant: getImagesForRestaurant
    };
  }
});


var file_queries = Object.freeze({
	fileFragment: fileFragment,
	imageFragment: imageFragment,
	getImagesForRestaurant: getImagesForRestaurant
});

var _templateObject$5 = _taggedTemplateLiteral$5(['\n\tfragment restaurantI18nInfo on RestaurantI18n {\n\t\tlanguage\n\t\tname\n\t\tdescription\n\t\tnodeId\n\t\trestaurant\n\t}\n'], ['\n\tfragment restaurantI18nInfo on RestaurantI18n {\n\t\tlanguage\n\t\tname\n\t\tdescription\n\t\tnodeId\n\t\trestaurant\n\t}\n']);
var _templateObject2$3 = _taggedTemplateLiteral$5(['\n\tfragment restaurantInfo on Restaurant {\n\t\tid\n\t\tcreatedBy\n\t\taddressByAddress {\n\t\t\t...addressInfo\n\t\t}\n\t\trestaurantImagesByRestaurant {\n\t\t\tnodes {\n\t\t\t\timageByImage {\n\t\t\t\t\t...imageInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tcurrencyByCurrency {\n\t\t\t...currencyInfo\n\t\t}\n\t\trestaurantI18nsByRestaurant {\n\t\t\tnodes {\n\t\t\t\t...restaurantI18nInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t', '\n\t', '\n\t', '\n'], ['\n\tfragment restaurantInfo on Restaurant {\n\t\tid\n\t\tcreatedBy\n\t\taddressByAddress {\n\t\t\t...addressInfo\n\t\t}\n\t\trestaurantImagesByRestaurant {\n\t\t\tnodes {\n\t\t\t\timageByImage {\n\t\t\t\t\t...imageInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tcurrencyByCurrency {\n\t\t\t...currencyInfo\n\t\t}\n\t\trestaurantI18nsByRestaurant {\n\t\t\tnodes {\n\t\t\t\t...restaurantI18nInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t', '\n\t', '\n\t', '\n']);
var _templateObject3$2 = _taggedTemplateLiteral$5(['\n\tquery restaurantById($id: Int!) {\n\t\trestaurantById(id: $id) {\n\t\t\t...restaurantInfo\n\t\t}\n\t}\n\t', '\n'], ['\n\tquery restaurantById($id: Int!) {\n\t\trestaurantById(id: $id) {\n\t\t\t...restaurantInfo\n\t\t}\n\t}\n\t', '\n']);

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties$2(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$5(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var restaurantI18nFragment = gql(_templateObject$5);

var restaurantFragment = gql(_templateObject2$3, currencyFragment, imageFragment, addressFragment, restaurantI18nFragment);

var formatRestaurant = function formatRestaurant() {
	var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _restaurant$restauran = restaurant.restaurantI18nsByRestaurant,
	    restaurantI18nsByRestaurant = _restaurant$restauran === undefined ? {} : _restaurant$restauran,
	    currency = restaurant.currencyByCurrency,
	    _restaurant$restauran2 = restaurant.restaurantImagesByRestaurant,
	    restaurantImagesByRestaurant = _restaurant$restauran2 === undefined ? {} : _restaurant$restauran2,
	    address = restaurant.addressByAddress,
	    rest = _objectWithoutProperties$2(restaurant, ['restaurantI18nsByRestaurant', 'currencyByCurrency', 'restaurantImagesByRestaurant', 'addressByAddress']);

	var i18n = Array.isArray(restaurantI18nsByRestaurant.nodes) ? restaurantI18nsByRestaurant.nodes.reduce(function (prev, val) {
		var language = val.language,
		    restI18n = _objectWithoutProperties$2(val, ['language']);

		return Object.assign({}, prev, _defineProperty$1({}, language, restI18n));
	}, {}) : [];
	var images = Array.isArray(restaurantImagesByRestaurant.nodes) ? restaurantImagesByRestaurant.nodes.map(function (node) {
		return node.imageByImage;
	}) : [];
	return Object.assign({}, rest, {
		i18n: i18n,
		currency: currency,
		images: images,
		address: address
	});
};

var getRestaurantQuery = gql(_templateObject3$2, restaurantFragment);

var getRestaurant = graphql(getRestaurantQuery, {
	skip: function skip(ownProps) {
		return typeof ownProps.restaurant !== 'number';
	},
	options: function options(ownProps) {
		return { variables: { id: ownProps.restaurant } };
	},
	props: function props(_ref) {
		var ownProps = _ref.ownProps,
		    data = _ref.data;

		var restaurantById = data.restaurantById,
		    getRestaurant = _objectWithoutProperties$2(data, ['restaurantById']);

		return {
			restaurant: getRestaurant.loading ? ownProps.restaurant : formatRestaurant(restaurantById),
			getRestaurant: getRestaurant
		};
	}
});


var restaurantQueries = Object.freeze({
	restaurantI18nFragment: restaurantI18nFragment,
	restaurantFragment: restaurantFragment,
	formatRestaurant: formatRestaurant,
	getRestaurantQuery: getRestaurantQuery,
	getRestaurant: getRestaurant
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject$4 = _taggedTemplateLiteral$4(['\n\t\tquery {\n\t\t\tgetActiveAccount {\n\t\t\t\t...accountInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery {\n\t\t\tgetActiveAccount {\n\t\t\t\t...accountInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject2$2 = _taggedTemplateLiteral$4(['\n\t\tquery accountById($id: Int!) {\n\t\t\taccountById(id: $id) {\n\t\t\t\trestaurantAccountsByAccount {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\trestaurantByRestaurant {\n\t\t\t\t\t\t\t\t...restaurantInfo\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery accountById($id: Int!) {\n\t\t\taccountById(id: $id) {\n\t\t\t\trestaurantAccountsByAccount {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\trestaurantByRestaurant {\n\t\t\t\t\t\t\t\t...restaurantInfo\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject3$1 = _taggedTemplateLiteral$4(['\n\t\tquery accountsByRestaurant($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\trestaurantAccountsByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\taccountRoleByRole {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\taccountByAccount {\n\t\t\t\t\t\t\t\t...accountInfo\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery accountsByRestaurant($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\trestaurantAccountsByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\taccountRoleByRole {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\taccountByAccount {\n\t\t\t\t\t\t\t\t...accountInfo\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject4$1 = _taggedTemplateLiteral$4(['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\taccountRolesForRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tnodeId\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t'], ['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\taccountRolesForRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tnodeId\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t']);

function _objectWithoutProperties$1(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$4(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getActiveAccount = graphql(gql(_templateObject$4, accountFragment), {
	props: function props(_ref) {
		var ownProps = _ref.ownProps,
		    _ref$data = _ref.data,
		    account = _ref$data.getActiveAccount,
		    getActiveAccount = _objectWithoutProperties$1(_ref$data, ['getActiveAccount']);

		return {
			account: formatAccount(account),
			getActiveAccount: getActiveAccount
		};
	}
});

var getRestaurantsByAccount = graphql(gql(_templateObject2$2, restaurantFragment), {
	skip: function skip(ownProps) {
		return _typeof(ownProps.account) === 'object' && !get(['account', 'id'])(ownProps);
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof(ownProps.account) === 'object' && ownProps.account ? ownProps.account.id : ownProps.account
			}
		};
	},
	props: function props(_ref2) {
		var ownProps = _ref2.ownProps,
		    data = _ref2.data;

		var accountById = data.accountById,
		    getRestaurantsByAccount = _objectWithoutProperties$1(data, ['accountById']);

		return {
			restaurants: (get(['restaurantAccountsByAccount', 'edges'])(accountById) || []).map(function (edge) {
				return formatRestaurant(get(['node', 'restaurantByRestaurant'])(edge));
			}),
			getRestaurantsByAccount: getRestaurantsByAccount
		};
	}
});

var getAccountsByRestaurant = graphql(gql(_templateObject3$1, accountFragment), {
	skip: function skip(ownProps) {
		return !ownProps.restaurant;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof(ownProps.restaurant) === 'object' ? ownProps.restaurant.id : ownProps.restaurant
			}
		};
	},
	props: function props(_ref3) {
		var ownProps = _ref3.ownProps,
		    data = _ref3.data;

		var restaurantById = data.restaurantById,
		    getAccountsByRestaurant = _objectWithoutProperties$1(data, ['restaurantById']);

		return {
			accounts: (get(['restaurantAccountsByRestaurant', 'edges'])(restaurantById) || []).map(function (edge) {
				var _edge$node = edge.node,
				    accountRoleByRole = _edge$node.accountRoleByRole,
				    accountByAccount = _edge$node.accountByAccount;

				return {
					role: accountRoleByRole,
					account: formatAccount(accountByAccount) };
			}),
			getAccountsByRestaurant: getAccountsByRestaurant
		};
	}
});

var getAccountRolesForRestaurant = graphql(gql(_templateObject4$1), {
	skip: function skip(ownProps) {
		return !ownProps.restaurant;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof(ownProps.restaurant) === 'object' ? ownProps.restaurant.id : ownProps.restaurant
			}
		};
	},
	props: function props(_ref4) {
		var ownProps = _ref4.ownProps,
		    data = _ref4.data;

		var restaurantById = data.restaurantById,
		    getAccountRolesForRestaurant = _objectWithoutProperties$1(data, ['restaurantById']);

		return {
			roles: (get(['accountRolesForRestaurant', 'edges'])(restaurantById) || []).map(function (edge) {
				return edge.node;
			}),
			getAccountRolesForRestaurant: getAccountRolesForRestaurant
		};
	}
});


var accountQueries = Object.freeze({
	getActiveAccount: getActiveAccount,
	getRestaurantsByAccount: getRestaurantsByAccount,
	getAccountsByRestaurant: getAccountsByRestaurant,
	getAccountRolesForRestaurant: getAccountRolesForRestaurant
});

var _templateObject$9 = _taggedTemplateLiteral$9(['\n  fragment optionInfo on Option {\n    id\n    optionI18nsByOption {\n      nodes {\n        nodeId\n        language\n        name\n        description\n      }\n    }\n  }\n'], ['\n  fragment optionInfo on Option {\n    id\n    optionI18nsByOption {\n      nodes {\n        nodeId\n        language\n        name\n        description\n      }\n    }\n  }\n']);
var _templateObject2$7 = _taggedTemplateLiteral$9(['\n    query allOptions {\n      allOptions {\n        nodes {\n          ...optionInfo\n        }\n      }\n    }\n    ', '\n  '], ['\n    query allOptions {\n      allOptions {\n        nodes {\n          ...optionInfo\n        }\n      }\n    }\n    ', '\n  ']);

function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties$5(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$9(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var optionFragment = gql(_templateObject$9);

var formatOption = function formatOption() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var optionI18nsByOption = option.optionI18nsByOption,
      rest = _objectWithoutProperties$5(option, ['optionI18nsByOption']);

  var i18n = Array.isArray(optionI18nsByOption.nodes) ? optionI18nsByOption.nodes.reduce(function (prev, val) {
    var language = val.language,
        restInformation = _objectWithoutProperties$5(val, ['language']);

    return Object.assign({}, prev, _defineProperty$3({}, language, restInformation));
  }, {}) : [];
  return Object.assign({}, rest, { i18n: i18n });
};

var getOptions = graphql(gql(_templateObject2$7, optionFragment), {
  props: function props(_ref) {
    var ownProps = _ref.ownProps,
        data = _ref.data;

    var allOptions = data.allOptions,
        getOptions = _objectWithoutProperties$5(data, ['allOptions']);

    return {
      options: getOptions.loading ? [] : (get(['nodes'])(allOptions) || []).map(function (node) {
        return formatOption(node);
      }),
      getOptions: getOptions
    };
  }
});


var option_queries = Object.freeze({
	optionFragment: optionFragment,
	formatOption: formatOption,
	getOptions: getOptions
});

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject$8 = _taggedTemplateLiteral$8(['\n\tfragment menuItemTypeInfo on MenuItemType {\n\t\tid\n\t\tname\n\t\tdescription\n\t}\n'], ['\n\tfragment menuItemTypeInfo on MenuItemType {\n\t\tid\n\t\tname\n\t\tdescription\n\t}\n']);
var _templateObject2$6 = _taggedTemplateLiteral$8(['\n\tfragment menuItemCategoryInfo on MenuItemCategory {\n\t\tid\n\t\tname\n\t\tdescription\n\t}\n'], ['\n\tfragment menuItemCategoryInfo on MenuItemCategory {\n\t\tid\n\t\tname\n\t\tdescription\n\t}\n']);
var _templateObject3$5 = _taggedTemplateLiteral$8(['\n\tfragment menuItemInfo on MenuItem {\n\t\tid\n\t\trestaurant\n\t\tcreatedAt\n\t\tcreatedBy\n\t\tprice\n\t\tmenuItemTypeByType {\n\t\t\t...menuItemTypeInfo\n\t\t}\n\t\tmenuItemCategoryByCategory {\n\t\t\t...menuItemCategoryInfo\n\t\t}\n\t\tcurrencyByCurrency {\n\t\t\t...currencyInfo\n\t\t}\n\t\tmenuItemI18nsByMenuItem {\n\t\t\tnodes {\n\t\t\t\tnodeId\n\t\t\t\tlanguage\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t}\n\t\t}\n\t\tmenuItemDietsByMenuItem {\n\t\t\tnodes {\n\t\t\t\tdietByDiet {\n\t\t\t\t\t...dietInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tmenuItemImagesByMenuItem {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\timageByImage {\n\t\t\t\t\t\t...imageInfo\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tmenuItemOptionsByMenuItem {\n\t\t\tnodes {\n\t\t\t\tdefaultValue\n\t\t\t\toptionByOption {\n\t\t\t\t\t...optionInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t', '\n\t', '\n\t', '\n\t', '\n\t', '\n'], ['\n\tfragment menuItemInfo on MenuItem {\n\t\tid\n\t\trestaurant\n\t\tcreatedAt\n\t\tcreatedBy\n\t\tprice\n\t\tmenuItemTypeByType {\n\t\t\t...menuItemTypeInfo\n\t\t}\n\t\tmenuItemCategoryByCategory {\n\t\t\t...menuItemCategoryInfo\n\t\t}\n\t\tcurrencyByCurrency {\n\t\t\t...currencyInfo\n\t\t}\n\t\tmenuItemI18nsByMenuItem {\n\t\t\tnodes {\n\t\t\t\tnodeId\n\t\t\t\tlanguage\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t}\n\t\t}\n\t\tmenuItemDietsByMenuItem {\n\t\t\tnodes {\n\t\t\t\tdietByDiet {\n\t\t\t\t\t...dietInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tmenuItemImagesByMenuItem {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\timageByImage {\n\t\t\t\t\t\t...imageInfo\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tmenuItemOptionsByMenuItem {\n\t\t\tnodes {\n\t\t\t\tdefaultValue\n\t\t\t\toptionByOption {\n\t\t\t\t\t...optionInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t', '\n\t', '\n\t', '\n\t', '\n\t', '\n']);
var _templateObject4$3 = _taggedTemplateLiteral$8(['\n\t\tquery menuItemById($id: Int!) {\n\t\t\tmenuItemById(id: $id) {\n\t\t\t\t...menuItemInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery menuItemById($id: Int!) {\n\t\t\tmenuItemById(id: $id) {\n\t\t\t\t...menuItemInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject5$2 = _taggedTemplateLiteral$8(['\n\t\tquery allMenuItemTypes {\n\t\t\tallMenuItemTypes {\n\t\t\t\tnodes {\n\t\t\t\t\t...menuItemTypeInfo\n\t\t\t\t\tmenuItemCategoriesByType {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t...menuItemCategoryInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t\t', '\n\t'], ['\n\t\tquery allMenuItemTypes {\n\t\t\tallMenuItemTypes {\n\t\t\t\tnodes {\n\t\t\t\t\t...menuItemTypeInfo\n\t\t\t\t\tmenuItemCategoriesByType {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t...menuItemCategoryInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t\t', '\n\t']);
var _templateObject6$1 = _taggedTemplateLiteral$8(['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tmenuItemsByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...menuItemInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tmenuItemsByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...menuItemInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties$4(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$8(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var menuItemTypeFragment = gql(_templateObject$8);

var menuItemCategoryFragment = gql(_templateObject2$6);

var formatMenuItemCategory = function formatMenuItemCategory() {
	var menuItemCategory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var menuItemTypeByType = menuItemCategory.menuItemTypeByType,
	    rest = _objectWithoutProperties$4(menuItemCategory, ['menuItemTypeByType']);

	return Object.assign({}, rest, menuItemTypeByType ? { menuItemType: menuItemTypeByType } : null);
};

var menuItemFragment = gql(_templateObject3$5, currencyFragment, dietFragment, imageFragment, menuItemTypeFragment, menuItemCategoryFragment, optionFragment);

var formatMenuItem = function formatMenuItem() {
	var menuItem = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _menuItem$menuItemIma = menuItem.menuItemImagesByMenuItem,
	    menuItemImagesByMenuItem = _menuItem$menuItemIma === undefined ? {} : _menuItem$menuItemIma,
	    _menuItem$menuItemDie = menuItem.menuItemDietsByMenuItem,
	    menuItemDietsByMenuItem = _menuItem$menuItemDie === undefined ? {} : _menuItem$menuItemDie,
	    _menuItem$menuItemI = menuItem.menuItemI18nsByMenuItem,
	    menuItemI18nsByMenuItem = _menuItem$menuItemI === undefined ? {} : _menuItem$menuItemI,
	    _menuItem$menuItemCat = menuItem.menuItemCategoryByCategory,
	    menuItemCategoryByCategory = _menuItem$menuItemCat === undefined ? {} : _menuItem$menuItemCat,
	    _menuItem$menuItemTyp = menuItem.menuItemTypeByType,
	    menuItemTypeByType = _menuItem$menuItemTyp === undefined ? {} : _menuItem$menuItemTyp,
	    _menuItem$menuItemOpt = menuItem.menuItemOptionsByMenuItem,
	    menuItemOptionsByMenuItem = _menuItem$menuItemOpt === undefined ? {} : _menuItem$menuItemOpt,
	    currency = menuItem.currencyByCurrency,
	    rest = _objectWithoutProperties$4(menuItem, ['menuItemImagesByMenuItem', 'menuItemDietsByMenuItem', 'menuItemI18nsByMenuItem', 'menuItemCategoryByCategory', 'menuItemTypeByType', 'menuItemOptionsByMenuItem', 'currencyByCurrency']);

	var images = Array.isArray(menuItemImagesByMenuItem.edges) ? menuItemImagesByMenuItem.edges.map(function (edge) {
		return edge.node.imageByImage;
	}) : [];
	var diets = Array.isArray(menuItemDietsByMenuItem.nodes) ? menuItemDietsByMenuItem.nodes.map(function (node) {
		return formatDiet(node.dietByDiet);
	}) : [];
	var options = Array.isArray(menuItemOptionsByMenuItem.nodes) ? menuItemOptionsByMenuItem.nodes.map(function (node) {
		return _extends$1({ defaultValue: node.defaultValue }, formatOption(node.optionByOption));
	}) : [];
	var i18n = Array.isArray(menuItemI18nsByMenuItem.nodes) ? menuItemI18nsByMenuItem.nodes.reduce(function (prev, val) {
		var language = val.language,
		    restI18n = _objectWithoutProperties$4(val, ['language']);

		return Object.assign({}, prev, _defineProperty$2({}, language, restI18n));
	}, {}) : [];
	return Object.assign({}, rest, {
		images: images,
		i18n: i18n,
		currency: currency,
		diets: diets,
		options: options,
		menuItemCategory: formatMenuItemCategory(menuItemCategoryByCategory || {}),
		menuItemType: formatMenuItemType(menuItemTypeByType || {})
	});
};

var formatMenuItemType = function formatMenuItemType() {
	var menuItemType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var menuItemCategoriesByType = menuItemType.menuItemCategoriesByType,
	    rest = _objectWithoutProperties$4(menuItemType, ['menuItemCategoriesByType']);

	return Object.assign({}, rest, menuItemCategoriesByType ? { menuItemCategories: menuItemCategoriesByType.nodes } : null);
};

var getMenuItem = graphql(gql(_templateObject4$3, menuItemFragment), {
	skip: function skip(ownProps) {
		return typeof ownProps.menuItem !== 'number';
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: typeof ownProps.menuItem === 'number' ? ownProps.menuItem : null
			}
		};
	},
	props: function props(_ref) {
		var ownProps = _ref.ownProps,
		    data = _ref.data;

		var menuItemById = data.menuItemById,
		    getMenuItem = _objectWithoutProperties$4(data, ['menuItemById']);

		return {
			menuItem: getMenuItem.loading ? ownProps.menuItem : formatMenuItem(menuItemById),
			getMenuItem: getMenuItem
		};
	}
});

var getMenuItemTypes = graphql(gql(_templateObject5$2, menuItemTypeFragment, menuItemCategoryFragment), {
	props: function props(_ref2) {
		var ownProps = _ref2.ownProps,
		    data = _ref2.data;

		var allMenuItemTypes = data.allMenuItemTypes,
		    getMenuItemTypes = _objectWithoutProperties$4(data, ['allMenuItemTypes']);

		return {
			menuItemTypes: getMenuItemTypes.loading ? [] : (get(['nodes'])(allMenuItemTypes) || []).map(function (node) {
				return formatMenuItemType(node);
			}),
			getMenuItemTypes: getMenuItemTypes
		};
	}
});

var getMenuItemsByRestaurant = graphql(gql(_templateObject6$1, menuItemFragment), {
	skip: function skip(ownProps) {
		return !ownProps.restaurant;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof$2(ownProps.restaurant) === 'object' ? ownProps.restaurant.id : ownProps.restaurant
			}
		};
	},
	props: function props(_ref3) {
		var ownProps = _ref3.ownProps,
		    data = _ref3.data;

		var restaurantById = data.restaurantById,
		    getMenuItemsByRestaurant = _objectWithoutProperties$4(data, ['restaurantById']);

		return {
			menuItems: getMenuItemsByRestaurant.loading ? [] : (get(['menuItemsByRestaurant', 'edges'])(restaurantById) || []).map(function (edge) {
				return formatMenuItem(edge.node);
			}),
			getMenuItemsByRestaurant: getMenuItemsByRestaurant
		};
	}
});


var menuItemQueries = Object.freeze({
	menuItemTypeFragment: menuItemTypeFragment,
	menuItemCategoryFragment: menuItemCategoryFragment,
	formatMenuItemCategory: formatMenuItemCategory,
	menuItemFragment: menuItemFragment,
	formatMenuItem: formatMenuItem,
	formatMenuItemType: formatMenuItemType,
	getMenuItem: getMenuItem,
	getMenuItemTypes: getMenuItemTypes,
	getMenuItemsByRestaurant: getMenuItemsByRestaurant
});

var _templateObject$7 = _taggedTemplateLiteral$7(['\n\tmutation createMenuItem($menuItem: CreateMenuItemInput!) {\n\t\tcreateMenuItem(input: $menuItem) {\n\t\t\tmenuItem {\n\t\t\t\t...menuItemInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation createMenuItem($menuItem: CreateMenuItemInput!) {\n\t\tcreateMenuItem(input: $menuItem) {\n\t\t\tmenuItem {\n\t\t\t\t...menuItemInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);
var _templateObject2$5 = _taggedTemplateLiteral$7(['\n\tmutation updateMenuItem($input: UpdateMenuItemInput!) {\n\t\tupdateMenuItem(input: $input) {\n\t\t\tmenuItem {\n\t\t\t\t...menuItemInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation updateMenuItem($input: UpdateMenuItemInput!) {\n\t\tupdateMenuItem(input: $input) {\n\t\t\tmenuItem {\n\t\t\t\t...menuItemInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);
var _templateObject3$4 = _taggedTemplateLiteral$7(['\n\tmutation deleteMenuItem($input: DeleteMenuItemInput!) {\n\t\tdeleteMenuItem(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation deleteMenuItem($input: DeleteMenuItemInput!) {\n\t\tdeleteMenuItem(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject4$2 = _taggedTemplateLiteral$7(['\n\tmutation createMenuItemI18n($input: CreateMenuItemI18nInput!) {\n\t\tcreateMenuItemI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation createMenuItemI18n($input: CreateMenuItemI18nInput!) {\n\t\tcreateMenuItemI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject5$1 = _taggedTemplateLiteral$7(['\n\tmutation updateMenuItemI18n($input: UpdateMenuItemI18nInput!) {\n\t\tupdateMenuItemI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation updateMenuItemI18n($input: UpdateMenuItemI18nInput!) {\n\t\tupdateMenuItemI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject6 = _taggedTemplateLiteral$7(['\n\tmutation updateMenuItemImages($input: UpdateMenuItemImagesInput!) {\n\t\tupdateMenuItemImages(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation updateMenuItemImages($input: UpdateMenuItemImagesInput!) {\n\t\tupdateMenuItemImages(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject7 = _taggedTemplateLiteral$7(['\n\tmutation updateMenuItemDiets($input: UpdateMenuItemDietsInput!) {\n\t\tupdateMenuItemDiets(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation updateMenuItemDiets($input: UpdateMenuItemDietsInput!) {\n\t\tupdateMenuItemDiets(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject8 = _taggedTemplateLiteral$7(['\n\tmutation updateMenuItemOptions($input: UpdateMenuItemOptionsInput!) {\n\t\tupdateMenuItemOptions(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation updateMenuItemOptions($input: UpdateMenuItemOptionsInput!) {\n\t\tupdateMenuItemOptions(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);

function _taggedTemplateLiteral$7(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var createMenuItem = graphql(gql(_templateObject$7, menuItemFragment), {
	props: function props(_ref) {
		var mutate = _ref.mutate;
		return {
			createMenuItem: function createMenuItem(menuItem) {
				return mutate({
					variables: { menuItem: { menuItem: menuItem } }
				});
			}
		};
	}
});

var updateMenuItem = graphql(gql(_templateObject2$5, menuItemFragment), {
	props: function props(_ref2) {
		var mutate = _ref2.mutate;
		return {
			updateMenuItem: function updateMenuItem(menuItem) {
				return mutate({ variables: {
						input: { menuItem: omit(['__typename', 'nodeId'])(menuItem) }
					} });
			}
		};
	}
});

var deleteMenuItem = graphql(gql(_templateObject3$4), {
	props: function props(_ref3) {
		var mutate = _ref3.mutate;
		return {
			deleteMenuItem: function deleteMenuItem(menuItem) {
				return mutate({ variables: {
						input: { menuItem: get('id')(menuItem) || menuItem }
					} });
			}
		};
	}
});

var createMenuItemI18n = graphql(gql(_templateObject4$2), {
	props: function props(_ref4) {
		var mutate = _ref4.mutate;
		return {
			createMenuItemI18n: function createMenuItemI18n(menuItemI18nItems) {
				(Array.isArray(menuItemI18nItems) ? menuItemI18nItems : [menuItemI18nItems]).forEach(function (menuItemI18n) {
					return mutate({
						variables: {
							input: { menuItemI18n: menuItemI18n }
						}
					});
				});
			}
		};
	}
});

var updateMenuItemI18n = graphql(gql(_templateObject5$1), {
	props: function props(_ref5) {
		var mutate = _ref5.mutate;
		return {
			updateMenuItemI18n: function updateMenuItemI18n(menuItemI18nItems) {
				return (Array.isArray(menuItemI18nItems) ? menuItemI18nItems : [menuItemI18nItems]).forEach(function (menuItemI18n) {
					return mutate({ variables: {
							input: {
								menuItemI18n: omit(['__typename', 'nodeId'])(menuItemI18n)
							}
						} });
				});
			}
		};
	}
});

var updateMenuItemImages = graphql(gql(_templateObject6), {
	props: function props(_ref6) {
		var mutate = _ref6.mutate;
		return {
			updateMenuItemImages: function updateMenuItemImages(menuItem, images) {
				return mutate({
					variables: {
						input: { menuItem: menuItem, images: images }
					}
				});
			}
		};
	}
});

var updateMenuItemDiets = graphql(gql(_templateObject7), {
	props: function props(_ref7) {
		var mutate = _ref7.mutate;
		return {
			updateMenuItemDiets: function updateMenuItemDiets(menuItem, diets) {
				return mutate({
					variables: {
						input: { menuItem: menuItem, diets: diets }
					}
				});
			}
		};
	}
});

var updateMenuItemOptions = graphql(gql(_templateObject8), {
	props: function props(_ref8) {
		var mutate = _ref8.mutate;
		return {
			updateMenuItemOptions: function updateMenuItemOptions(menuItem, menuItemOptions) {
				return mutate({
					variables: {
						input: {
							menuItem: menuItem,
							menuItemOptions: menuItemOptions.map(function (_ref9) {
								var menuItem = _ref9.menuItem,
								    id = _ref9.id,
								    option = _ref9.option,
								    defaultValue = _ref9.defaultValue;
								return {
									option: id || option,
									defaultValue: defaultValue,
									menuItem: menuItem
								};
							})
						}
					}
				});
			}
		};
	}
});

var menuItemMutations = Object.freeze({
	createMenuItem: createMenuItem,
	updateMenuItem: updateMenuItem,
	deleteMenuItem: deleteMenuItem,
	createMenuItemI18n: createMenuItemI18n,
	updateMenuItemI18n: updateMenuItemI18n,
	updateMenuItemImages: updateMenuItemImages,
	updateMenuItemDiets: updateMenuItemDiets,
	updateMenuItemOptions: updateMenuItemOptions
});

var _typeof$4 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject$11 = _taggedTemplateLiteral$11(['\n\tfragment orderItemInfo on OrderItem {\n\t\tid\n\t\tmenuItemByMenuItem {\n\t\t\t...menuItemInfo\n\t\t}\n\t}\n\t', '\n'], ['\n\tfragment orderItemInfo on OrderItem {\n\t\tid\n\t\tmenuItemByMenuItem {\n\t\t\t...menuItemInfo\n\t\t}\n\t}\n\t', '\n']);
var _templateObject2$9 = _taggedTemplateLiteral$11(['\n\tfragment orderInfo on Order {\n\t\tid\n\t\tcreatedAt\n\t\tcompleted\n\t\tupdatedAt\n\t\taccepted\n\t\tdeclined\n\t\tpaid\n\t\tmessage\n\t\tservingLocation\n\t\tservingLocationByServingLocation {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\trestaurant\n\t\tcreatedBy\n\t\taccountByCreatedBy {\n\t\t\t...accountInfo\n\t\t}\n\t\torderItemsByOrder {\n\t\t\tnodes {\n\t\t\t\t...orderItemInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t', '\n'], ['\n\tfragment orderInfo on Order {\n\t\tid\n\t\tcreatedAt\n\t\tcompleted\n\t\tupdatedAt\n\t\taccepted\n\t\tdeclined\n\t\tpaid\n\t\tmessage\n\t\tservingLocation\n\t\tservingLocationByServingLocation {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\trestaurant\n\t\tcreatedBy\n\t\taccountByCreatedBy {\n\t\t\t...accountInfo\n\t\t}\n\t\torderItemsByOrder {\n\t\t\tnodes {\n\t\t\t\t...orderItemInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t', '\n']);
var _templateObject3$6 = _taggedTemplateLiteral$11(['\n\t\tquery orderById($id: Int!) {\n\t\t\torderById(id: $id) {\n\t\t\t\t...orderInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery orderById($id: Int!) {\n\t\t\torderById(id: $id) {\n\t\t\t\t...orderInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject4$4 = _taggedTemplateLiteral$11(['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tordersByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...orderInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tordersByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...orderInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject5$3 = _taggedTemplateLiteral$11(['\n\t\tquery accountById($id: Int!) {\n\t\t\taccountById(id: $id) {\n\t\t\t\tid\n\t\t\t\tordersByCreatedBy {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...orderInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery accountById($id: Int!) {\n\t\t\taccountById(id: $id) {\n\t\t\t\tid\n\t\t\t\tordersByCreatedBy {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...orderInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);

function _objectWithoutProperties$6(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$11(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var orderItemFragment = gql(_templateObject$11, menuItemFragment);

var orderFragment = gql(_templateObject2$9, accountFragment, orderItemFragment);

var formatOrderItem = function formatOrderItem() {
	var orderItem = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var menuItem = orderItem.menuItemByMenuItem,
	    rest = _objectWithoutProperties$6(orderItem, ['menuItemByMenuItem']);

	return Object.assign({}, rest, { menuItem: formatMenuItem(menuItem) });
};

var formatOrder = function formatOrder() {
	var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var createdBy = order.accountByCreatedBy,
	    _order$orderItemsByOr = order.orderItemsByOrder.nodes,
	    nodes = _order$orderItemsByOr === undefined ? [] : _order$orderItemsByOr,
	    servingLocation = order.servingLocationByServingLocation,
	    rest = _objectWithoutProperties$6(order, ['accountByCreatedBy', 'orderItemsByOrder', 'servingLocationByServingLocation']);

	return Object.assign({}, rest, {
		servingLocation: servingLocation,
		createdBy: formatAccount(createdBy),
		items: nodes.map(function (node) {
			return formatOrderItem(node);
		})
	});
};

var getOrder = graphql(gql(_templateObject3$6, orderFragment), {
	skip: function skip(ownProps) {
		return !ownProps.order;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: typeof ownProps.order === 'number' ? ownProps.order : get(['order', 'id'])(ownProps)
			}
		};
	},
	props: function props(_ref) {
		var ownProps = _ref.ownProps,
		    data = _ref.data;

		var orderById = data.orderById,
		    getOrder = _objectWithoutProperties$6(data, ['orderById']);

		return {
			order: getOrder.loading ? ownProps.order : formatOrder(orderById),
			getOrder: getOrder
		};
	}
});

var getOrdersByRestaurant = graphql(gql(_templateObject4$4, orderFragment), {
	skip: function skip(ownProps) {
		return !ownProps.restaurant;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof$4(ownProps.restaurant) === 'object' ? ownProps.restaurant.id : ownProps.restaurant
			}
		};
	},
	props: function props(_ref2) {
		var ownProps = _ref2.ownProps,
		    data = _ref2.data;

		var restaurantById = data.restaurantById,
		    getOrdersByRestaurant = _objectWithoutProperties$6(data, ['restaurantById']);

		return {
			orders: getOrdersByRestaurant.loading ? [] : (get(['ordersByRestaurant', 'edges'])(restaurantById) || []).map(function (edge) {
				return formatOrder(edge.node);
			}),
			getOrdersByRestaurant: getOrdersByRestaurant
		};
	}
});

var getOrdersByAccount = graphql(gql(_templateObject5$3, orderFragment), {
	skip: function skip(ownProps) {
		return !ownProps.account;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof$4(ownProps.account) === 'object' ? ownProps.account.id : ownProps.account
			}
		};
	},
	props: function props(_ref3) {
		var ownProps = _ref3.ownProps,
		    data = _ref3.data;

		var accountById = data.accountById,
		    getOrdersByAccount = _objectWithoutProperties$6(data, ['accountById']);

		return {
			orders: getOrdersByAccount.loading ? [] : (get(['ordersByCreatedBy', 'edges'])(accountById) || []).map(function (edge) {
				return formatOrder(edge.node);
			}),
			getOrdersByAccount: getOrdersByAccount
		};
	}
});


var orderQueries = Object.freeze({
	orderItemFragment: orderItemFragment,
	orderFragment: orderFragment,
	formatOrderItem: formatOrderItem,
	formatOrder: formatOrder,
	getOrder: getOrder,
	getOrdersByRestaurant: getOrdersByRestaurant,
	getOrdersByAccount: getOrdersByAccount
});

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject$10 = _taggedTemplateLiteral$10(['\n\tmutation createOrder($input: CreateOrderInput!) {\n\t\tcreateOrder(input: $input) {\n\t\t\torder {\n\t\t\t\t...orderInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation createOrder($input: CreateOrderInput!) {\n\t\tcreateOrder(input: $input) {\n\t\t\torder {\n\t\t\t\t...orderInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);
var _templateObject2$8 = _taggedTemplateLiteral$10(['\n\tmutation updateOrder($input: UpdateOrderInput!) {\n\t\tupdateOrder(input: $input) {\n\t\t\torder {\n\t\t\t\t...orderInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation updateOrder($input: UpdateOrderInput!) {\n\t\tupdateOrder(input: $input) {\n\t\t\torder {\n\t\t\t\t...orderInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);

function _taggedTemplateLiteral$10(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var createOrder = graphql(gql(_templateObject$10, orderFragment), {
	props: function props(_ref) {
		var mutate = _ref.mutate;
		return {
			createOrder: function createOrder(order, items) {
				return mutate({
					variables: {
						input: {
							order: order,
							items: items
						}
					}
				});
			}
		};
	}
});

var updateOrder = graphql(gql(_templateObject2$8, orderFragment), {
	props: function props(_ref2) {
		var mutate = _ref2.mutate;
		return {
			updateOrder: function updateOrder(order) {
				return mutate({ variables: {
						input: {
							order: Object.assign(pick(['id', 'accepted', 'declined', 'completed'])(order), {
								restaurant: _typeof$3(order.restaurant) === 'object' ? order.restaurant.id : order.restaurant,
								servingLocation: _typeof$3(order.servingLocation) === 'object' ? order.servingLocation.id : order.servingLocation,
								createdBy: _typeof$3(order.createdBy) === 'object' ? order.createdBy.id : order.restaurant
							})
						}
					} });
			}
		};
	}
});

var orderMutations = Object.freeze({
	createOrder: createOrder,
	updateOrder: updateOrder
});

var _typeof$5 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject$13 = _taggedTemplateLiteral$13(['\n\tfragment menuInfo on Menu {\n\t\tid\n\t\tmenuI18nsByMenu {\n\t\t\tnodes {\n\t\t\t\tnodeId\n\t\t\t\tlanguage\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t}\n\t\t}\n\t\tmenuMenuItemsByMenu {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tmenuItemByMenuItem {\n\t\t\t\t\t\t...menuItemInfo\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t', '\n'], ['\n\tfragment menuInfo on Menu {\n\t\tid\n\t\tmenuI18nsByMenu {\n\t\t\tnodes {\n\t\t\t\tnodeId\n\t\t\t\tlanguage\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t}\n\t\t}\n\t\tmenuMenuItemsByMenu {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tmenuItemByMenuItem {\n\t\t\t\t\t\t...menuItemInfo\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t', '\n']);
var _templateObject2$11 = _taggedTemplateLiteral$13(['\n\t\tquery menuById($id: Int!) {\n\t\t\tid\n\t\t\tmenuById(id: $id) {\n\t\t\t\t...menuInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery menuById($id: Int!) {\n\t\t\tid\n\t\t\tmenuById(id: $id) {\n\t\t\t\t...menuInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject3$8 = _taggedTemplateLiteral$13(['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tmenusByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...menuInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tmenusByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...menuInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);

function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties$7(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$13(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var menuFragment = gql(_templateObject$13, menuItemFragment);

var formatMenu = function formatMenu() {
	var menu = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _menu$menuMenuItemsBy = menu.menuMenuItemsByMenu,
	    menuMenuItemsByMenu = _menu$menuMenuItemsBy === undefined ? {} : _menu$menuMenuItemsBy,
	    _menu$menuI18nsByMenu = menu.menuI18nsByMenu,
	    menuI18nsByMenu = _menu$menuI18nsByMenu === undefined ? {} : _menu$menuI18nsByMenu,
	    rest = _objectWithoutProperties$7(menu, ['menuMenuItemsByMenu', 'menuI18nsByMenu']);

	var menuItems = Array.isArray(menuMenuItemsByMenu.edges) ? menuMenuItemsByMenu.edges.map(function (edge) {
		return formatMenuItem(edge.node.menuItemByMenuItem);
	}) : [];
	var i18n = Array.isArray(menuI18nsByMenu.nodes) ? menuI18nsByMenu.nodes.reduce(function (prev, val) {
		var language = val.language,
		    restI18n = _objectWithoutProperties$7(val, ['language']);

		return Object.assign({}, prev, _defineProperty$4({}, language, restI18n));
	}, {}) : [];
	return Object.assign({}, rest, { menuItems: menuItems, i18n: i18n });
};

var getMenu = graphql(gql(_templateObject2$11, menuFragment), {
	skip: function skip(ownProps) {
		return typeof ownProps.menu !== 'number';
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: typeof ownProps.menu === 'number' ? ownProps.menu : null
			}
		};
	},
	props: function props(_ref) {
		var ownProps = _ref.ownProps,
		    data = _ref.data;

		var menuById = data.menuById,
		    getMenu = _objectWithoutProperties$7(data, ['menuById']);

		return {
			menu: getMenu.loading ? ownProps.menu : formatMenu(menuById),
			getMenu: getMenu
		};
	}
});

var getMenusByRestaurant = graphql(gql(_templateObject3$8, menuFragment), {
	skip: function skip(ownProps) {
		return !ownProps.restaurant;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof$5(ownProps.restaurant) === 'object' ? ownProps.restaurant.id : ownProps.restaurant
			}
		};
	},
	props: function props(_ref2) {
		var ownProps = _ref2.ownProps,
		    data = _ref2.data;

		var restaurantById = data.restaurantById,
		    getMenusByRestaurant = _objectWithoutProperties$7(data, ['restaurantById']);

		return {
			menus: getMenusByRestaurant.loading ? [] : (get(['menusByRestaurant', 'edges'])(restaurantById) || []).map(function (edge) {
				return formatMenu(edge.node);
			}),
			getMenusByRestaurant: getMenusByRestaurant
		};
	}
});


var menuQueries = Object.freeze({
	menuFragment: menuFragment,
	formatMenu: formatMenu,
	getMenu: getMenu,
	getMenusByRestaurant: getMenusByRestaurant
});

var _templateObject$12 = _taggedTemplateLiteral$12(['\n\tmutation createMenu($input: CreateMenuInput!) {\n\t\tcreateMenu(input: $input) {\n\t\t\tmenu {\n\t\t\t\t...menuInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation createMenu($input: CreateMenuInput!) {\n\t\tcreateMenu(input: $input) {\n\t\t\tmenu {\n\t\t\t\t...menuInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);
var _templateObject2$10 = _taggedTemplateLiteral$12(['\n\tmutation updateMenu($input: UpdateMenuInput!) {\n\t\tupdateMenu(input: $input) {\n\t\t\tmenu {\n\t\t\t\t...menuInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation updateMenu($input: UpdateMenuInput!) {\n\t\tupdateMenu(input: $input) {\n\t\t\tmenu {\n\t\t\t\t...menuInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);
var _templateObject3$7 = _taggedTemplateLiteral$12(['\n\tmutation deleteMenu($input: DeleteMenuInput!) {\n\t\tdeleteMenu(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation deleteMenu($input: DeleteMenuInput!) {\n\t\tdeleteMenu(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject4$5 = _taggedTemplateLiteral$12(['\n\tmutation createMenuI18n($input: CreateMenuI18nInput!) {\n\t\tcreateMenuI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation createMenuI18n($input: CreateMenuI18nInput!) {\n\t\tcreateMenuI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject5$4 = _taggedTemplateLiteral$12(['\n\tmutation updateMenuI18n($input: UpdateMenuI18nInput!) {\n\t\tupdateMenuI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation updateMenuI18n($input: UpdateMenuI18nInput!) {\n\t\tupdateMenuI18n(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);
var _templateObject6$2 = _taggedTemplateLiteral$12(['\n\tmutation updateMenuItems($input: UpdateMenuItemsInput!) {\n\t\tupdateMenuItems(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t'], ['\n\tmutation updateMenuItems($input: UpdateMenuItemsInput!) {\n\t\tupdateMenuItems(input: $input) {\n\t\t\tclientMutationId\n\t\t}\n\t}\n\t']);

function _taggedTemplateLiteral$12(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var createMenu = graphql(gql(_templateObject$12, menuFragment), {
	props: function props(_ref) {
		var mutate = _ref.mutate;
		return {
			createMenu: function createMenu(menu) {
				return mutate({ variables: { input: { menu: menu } } });
			}
		};
	}
});

var updateMenu = graphql(gql(_templateObject2$10, menuFragment), {
	props: function props(_ref2) {
		var mutate = _ref2.mutate;
		return {
			updateMenu: function updateMenu(menu) {
				return mutate({ variables: {
						input: { menu: omit(['__typename', 'nodeId'])(menu) }
					} });
			}
		};
	}
});

var deleteMenu = graphql(gql(_templateObject3$7), {
	props: function props(_ref3) {
		var mutate = _ref3.mutate;
		return {
			deleteMenu: function deleteMenu(menu) {
				return mutate({ variables: {
						input: { menu: get('id')(menu) || menu }
					} });
			}
		};
	}
});

var createMenuI18n = graphql(gql(_templateObject4$5), {
	props: function props(_ref4) {
		var mutate = _ref4.mutate;
		return {
			createMenuI18n: function createMenuI18n(menuI18nItems) {
				(Array.isArray(menuI18nItems) ? menuI18nItems : [menuI18nItems]).forEach(function (menuI18n) {
					return mutate({
						variables: {
							input: { menuI18n: menuI18n }
						}
					});
				});
			}
		};
	}
});

var updateMenuI18n = graphql(gql(_templateObject5$4), {
	props: function props(_ref5) {
		var mutate = _ref5.mutate;
		return {
			updateMenuI18n: function updateMenuI18n(menuI18nItems) {
				return (Array.isArray(menuI18nItems) ? menuI18nItems : [menuI18nItems]).forEach(function (menuI18n) {
					return mutate({ variables: {
							input: {
								menuI18n: omit(['__typename', 'nodeId'])(menuI18n)
							}
						} });
				});
			}
		};
	}
});

var updateMenuItems = graphql(gql(_templateObject6$2), {
	props: function props(_ref6) {
		var mutate = _ref6.mutate;
		return {
			updateMenuItems: function updateMenuItems(menu, menuItems) {
				return mutate({
					variables: {
						input: { menu: menu, menuItems: menuItems }
					}
				});
			}
		};
	}
});

var menuMutations = Object.freeze({
	createMenu: createMenu,
	updateMenu: updateMenu,
	deleteMenu: deleteMenu,
	createMenuI18n: createMenuI18n,
	updateMenuI18n: updateMenuI18n,
	updateMenuItems: updateMenuItems
});

var _typeof$6 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject$15 = _taggedTemplateLiteral$15(['\n\tfragment servingLocationInfo on ServingLocation {\n\t\tid\n\t\tname\n\t\tenabled\n\t\tcreatedAt\n\t\trestaurant\n\t\tservingLocationAccountsByServingLocation {\n\t\t\tnodes {\n\t\t\t\taccountByAccount {\n\t\t\t\t\t...accountInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t', '\n'], ['\n\tfragment servingLocationInfo on ServingLocation {\n\t\tid\n\t\tname\n\t\tenabled\n\t\tcreatedAt\n\t\trestaurant\n\t\tservingLocationAccountsByServingLocation {\n\t\t\tnodes {\n\t\t\t\taccountByAccount {\n\t\t\t\t\t...accountInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t', '\n']);
var _templateObject2$13 = _taggedTemplateLiteral$15(['\n\t\tquery servingLocationById($id: Int!) {\n\t\t\tservingLocationById(id: $id) {\n\t\t\t\t...servingLocationInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery servingLocationById($id: Int!) {\n\t\t\tservingLocationById(id: $id) {\n\t\t\t\t...servingLocationInfo\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject3$9 = _taggedTemplateLiteral$15(['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tservingLocationsByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...servingLocationInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tquery restaurantById($id: Int!) {\n\t\t\trestaurantById(id: $id) {\n\t\t\t\tid\n\t\t\t\tservingLocationsByRestaurant {\n\t\t\t\t\tedges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...servingLocationInfo\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);

function _objectWithoutProperties$8(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral$15(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var servingLocationFragment = gql(_templateObject$15, accountFragment);

var formatServingLocation = function formatServingLocation() {
	var servingLocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _servingLocation$serv = servingLocation.servingLocationAccountsByServingLocation,
	    servingLocationAccountsByServingLocation = _servingLocation$serv === undefined ? {} : _servingLocation$serv,
	    rest = _objectWithoutProperties$8(servingLocation, ['servingLocationAccountsByServingLocation']);

	var accounts = Array.isArray(servingLocationAccountsByServingLocation.nodes) ? servingLocationAccountsByServingLocation.nodes.map(function (node) {
		return formatAccount(node.accountByAccount);
	}) : [];
	return Object.assign({}, rest, { accounts: accounts });
};

var getServingLocation = graphql(gql(_templateObject2$13, servingLocationFragment), {
	skip: function skip(ownProps) {
		return typeof ownProps.servingLocation !== 'number';
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: ownProps.servingLocation
			}
		};
	},
	props: function props(_ref) {
		var ownProps = _ref.ownProps,
		    data = _ref.data;

		var servingLocationById = data.servingLocationById,
		    getServingLocation = _objectWithoutProperties$8(data, ['servingLocationById']);

		return {
			servingLocation: formatServingLocation(servingLocationById),
			getServingLocation: getServingLocation
		};
	}
});

var getServingLocationsByRestaurant = graphql(gql(_templateObject3$9, servingLocationFragment), {
	skip: function skip(ownProps) {
		return !ownProps.restaurant;
	},
	options: function options(ownProps) {
		return {
			variables: {
				id: _typeof$6(ownProps.restaurant) === 'object' ? ownProps.restaurant.id : ownProps.restaurant
			}
		};
	},
	props: function props(_ref2) {
		var ownProps = _ref2.ownProps,
		    data = _ref2.data;

		var restaurantById = data.restaurantById,
		    getServingLocationsByRestaurant = _objectWithoutProperties$8(data, ['restaurantById']);

		return {
			servingLocations: getServingLocationsByRestaurant.loading ? [] : (get(['servingLocationsByRestaurant', 'edges'])(restaurantById) || []).map(function (edge) {
				return formatServingLocation(edge.node);
			}),
			getServingLocationsByRestaurant: getServingLocationsByRestaurant
		};
	}
});


var servingLocationQueries = Object.freeze({
	servingLocationFragment: servingLocationFragment,
	formatServingLocation: formatServingLocation,
	getServingLocation: getServingLocation,
	getServingLocationsByRestaurant: getServingLocationsByRestaurant
});

var _templateObject$14 = _taggedTemplateLiteral$14(['\n\tmutation createServingLocation($input: CreateServingLocationInput!) {\n\t\tcreateServingLocation(input: $input) {\n\t\t\tservingLocation {\n\t\t\t\t...servingLocationInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation createServingLocation($input: CreateServingLocationInput!) {\n\t\tcreateServingLocation(input: $input) {\n\t\t\tservingLocation {\n\t\t\t\t...servingLocationInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);
var _templateObject2$12 = _taggedTemplateLiteral$14(['\n\tmutation updateServingLocation($input: UpdateServingLocationInput!) {\n\t\tupdateServingLocation(input: $input) {\n\t\t\tservingLocation {\n\t\t\t\t...servingLocationInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t'], ['\n\tmutation updateServingLocation($input: UpdateServingLocationInput!) {\n\t\tupdateServingLocation(input: $input) {\n\t\t\tservingLocation {\n\t\t\t\t...servingLocationInfo\n\t\t\t}\n\t\t}\n\t}\n\t', '\n\t']);

function _taggedTemplateLiteral$14(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var createServingLocation = graphql(gql(_templateObject$14, servingLocationFragment), {
	props: function props(_ref) {
		var mutate = _ref.mutate;
		return {
			createServingLocation: function createServingLocation(servingLocation) {
				return mutate({
					variables: { input: { servingLocation: servingLocation } }
				});
			}
		};
	}
});

var updateServingLocation = graphql(gql(_templateObject2$12, servingLocationFragment), {
	props: function props(_ref2) {
		var mutate = _ref2.mutate;
		return {
			updateServingLocation: function updateServingLocation(servingLocation) {
				return mutate({ variables: {
						input: { servingLocation: omit(['__typename', 'nodeId'])(servingLocation) }
					} });
			}
		};
	}
});

var servingLocationMutations = Object.freeze({
	createServingLocation: createServingLocation,
	updateServingLocation: updateServingLocation
});

var dataIdFromObject = function dataIdFromObject(result) {
  return result.__typename && result.id ? result.__typename + "_" + result.id : result.nodeId;
};

var _templateObject$16 = _taggedTemplateLiteral$16(['\n\t\tmutation createRestaurant($input: CreateRestaurantInput!) {\n\t\t\tcreateRestaurant(input: $input) {\n\t\t\t\trestaurant {\n\t\t\t\t\t...restaurantInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tmutation createRestaurant($input: CreateRestaurantInput!) {\n\t\t\tcreateRestaurant(input: $input) {\n\t\t\t\trestaurant {\n\t\t\t\t\t...restaurantInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject2$14 = _taggedTemplateLiteral$16(['\n\t\tmutation createRestaurantI18n($input: CreateRestaurantI18nInput!) {\n\t\t\tcreateRestaurantI18n(input: $input) {\n\t\t\t\trestaurantI18n {\n\t\t\t\t\t...restaurantI18nInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tmutation createRestaurantI18n($input: CreateRestaurantI18nInput!) {\n\t\t\tcreateRestaurantI18n(input: $input) {\n\t\t\t\trestaurantI18n {\n\t\t\t\t\t...restaurantI18nInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject3$10 = _taggedTemplateLiteral$16(['\n\t\tmutation updateRestaurantI18n($input: UpdateRestaurantI18nInput!) {\n\t\t\tupdateRestaurantI18n(input: $input) {\n\t\t\t\trestaurantI18n {\n\t\t\t\t\t...restaurantI18nInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tmutation updateRestaurantI18n($input: UpdateRestaurantI18nInput!) {\n\t\t\tupdateRestaurantI18n(input: $input) {\n\t\t\t\trestaurantI18n {\n\t\t\t\t\t...restaurantI18nInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);
var _templateObject4$6 = _taggedTemplateLiteral$16(['\n\t\tmutation updateRestaurant($input: UpdateRestaurantInput!) {\n\t\t\tupdateRestaurant(input: $input) {\n\t\t\t\trestaurant {\n\t\t\t\t\t...restaurantInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t', '\n\t'], ['\n\t\tmutation updateRestaurant($input: UpdateRestaurantInput!) {\n\t\t\tupdateRestaurant(input: $input) {\n\t\t\t\trestaurant {\n\t\t\t\t\t...restaurantInfo\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t', '\n\t']);
var _templateObject5$5 = _taggedTemplateLiteral$16(['\n\t\tmutation updateRestaurantImages($input: UpdateRestaurantImagesInput!) {\n\t\t\tupdateRestaurantImages(input: $input) {\n\t\t\t\trestaurantImages {\n\t\t\t\t\timageByImage {\n\t\t\t\t\t\t...imageInfo\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t'], ['\n\t\tmutation updateRestaurantImages($input: UpdateRestaurantImagesInput!) {\n\t\t\tupdateRestaurantImages(input: $input) {\n\t\t\t\trestaurantImages {\n\t\t\t\t\timageByImage {\n\t\t\t\t\t\t...imageInfo\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t', '\n\t']);

function _taggedTemplateLiteral$16(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var createRestaurant = graphql(gql(_templateObject$16, restaurantFragment), {
	props: function props(_ref) {
		var mutate = _ref.mutate;
		return {
			createRestaurant: function createRestaurant(restaurant) {
				return mutate({ variables: { input: { restaurant: restaurant } } });
			}
		};
	}
});

var createRestaurantI18n = graphql(gql(_templateObject2$14, restaurantI18nFragment), {
	props: function props(_ref2) {
		var mutate = _ref2.mutate;
		return {
			createRestaurantI18n: function createRestaurantI18n(items) {
				(Array.isArray(items) ? items : [items]).forEach(function (restaurantI18n) {
					return mutate({
						variables: {
							input: { restaurantI18n: restaurantI18n }
						},
						update: function update(store, _ref3) {
							var restaurantI18n = _ref3.data.createRestaurantI18n.restaurantI18n;

							var oldRestaurant = store.readQuery({
								query: getRestaurantQuery,
								variables: { id: restaurantI18n.restaurant }
							});
							var oldI18n = get(['restaurantById', 'restaurantI18nsByRestaurant', 'nodes'])(oldRestaurant);
							// should push translation to i18n, if it doesn't already exists
							if (!find(function (i) {
								return i.language === restaurantI18n.language;
							})(oldI18n)) {
								store.writeQuery({
									query: getRestaurantQuery,
									data: set(['restaurantById', 'restaurantI18nsByRestaurant', 'nodes'])(oldI18n.concat(restaurantI18n))(oldRestaurant)
								});
							}
						}
					});
				});
			}
		};
	}
});

var updateRestaurantI18n = graphql(gql(_templateObject3$10, restaurantI18nFragment), {
	props: function props(_ref4) {
		var mutate = _ref4.mutate;
		return {
			updateRestaurantI18n: function updateRestaurantI18n(items) {
				return (Array.isArray(items) ? items : [items]).forEach(function (restaurantI18n) {
					return mutate({
						variables: {
							input: {
								restaurantI18n: omit(['__typename', 'nodeId'])(restaurantI18n)
							}
						},
						update: function update(store, _ref5) {
							var restaurantI18n = _ref5.data.updateRestaurantI18n.restaurantI18n;
							return store.writeFragment({
								fragment: restaurantI18nFragment,
								id: dataIdFromObject(restaurantI18n),
								data: restaurantI18n
							});
						}
					});
				});
			}
		};
	}
});

var updateRestaurant = graphql(gql(_templateObject4$6, restaurantFragment), {
	props: function props(_ref6) {
		var mutate = _ref6.mutate;
		return {
			updateRestaurant: function updateRestaurant(restaurant) {
				return mutate({
					variables: {
						input: { restaurant: omit(['__typename', 'nodeId'])(restaurant) }
					},
					update: function update(store, _ref7) {
						var restaurant = _ref7.data.updateRestaurant.restaurant;
						return store.writeFragment({
							fragment: restaurantFragment,
							fragmentName: 'restaurantInfo',
							id: dataIdFromObject(restaurant),
							data: restaurant
						});
					}
				});
			}
		};
	}
});

var updateRestaurantImages = graphql(gql(_templateObject5$5, imageFragment), {
	props: function props(_ref8) {
		var mutate = _ref8.mutate;
		return {
			updateRestaurantImages: function updateRestaurantImages(restaurant, images) {
				return mutate({
					variables: {
						input: { restaurant: restaurant, images: images }
					},
					update: function update(store, _ref9) {
						var restaurantImages = _ref9.data.updateRestaurantImages.restaurantImages;

						var old = store.readQuery({
							query: getRestaurantQuery,
							variables: { id: restaurant }
						});
						store.writeQuery({
							query: getRestaurantQuery,
							data: set(['restaurantById', 'restaurantImagesByRestaurant', 'nodes'])(restaurantImages)(old)
						});
					}
				});
			}
		};
	}
});

var restaurantMutations = Object.freeze({
	createRestaurant: createRestaurant,
	createRestaurantI18n: createRestaurantI18n,
	updateRestaurantI18n: updateRestaurantI18n,
	updateRestaurant: updateRestaurant,
	updateRestaurantImages: updateRestaurantImages
});

var _this = undefined;

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject$17 = _taggedTemplateLiteral$17(['\n\t\t\t\tfragment fragment on ', ' {\n\t\t\t\t\t', '\n\t\t\t\t}\n\t\t\t'], ['\n\t\t\t\tfragment fragment on ', ' {\n\t\t\t\t\t', '\n\t\t\t\t}\n\t\t\t']);

function _taggedTemplateLiteral$17(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var subscribe = (function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, callback) {
		var url = _ref.url,
		    wsToken = _ref.wsToken,
		    client = _ref.client,
		    socket = _ref.socket;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						socket.on('notification', function (notification) {
							var record = notification.record,
							    table = notification.table,
							    operations = notification.operations;

							if (record, table, operations) {
								var target = pascalize(table);
								var object = _extends$2({ __typename: target }, camelizeKeys(record));
								var id = dataIdFromObject(_extends$2({ __typename: target }, record));
								var fragment = gql(_templateObject$17, target, Object.keys(object).reduce(function (prev, val) {
									return prev + val + '\n';
								}, ''));
								callback({
									notification: notification,
									target: target,
									operations: operations,
									newRecord: object,
									oldRecord: client.readFragment({
										id: id,
										fragment: fragment
									})
								});
								client.writeFragment({
									id: id,
									fragment: fragment,
									data: object
								});
							}
						});

					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function (_x, _x2) {
		return _ref2.apply(this, arguments);
	};
})();
module.exports = exports['default'];

var subscribe$1 = Object.freeze({
	default: subscribe
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var misc = _extends({}, miscQueries, miscMutations);

var account = _extends({}, accountFragments, accountQueries, accountMutations);

var menuItem = _extends({}, menuItemQueries, menuItemMutations);

var order = _extends({}, orderQueries, orderMutations);

var menu = _extends({}, menuQueries, menuMutations);

var servingLocation = _extends({}, servingLocationQueries, servingLocationMutations);

var restaurant = _extends({}, restaurantQueries, restaurantMutations);

export { restaurant, menu, menuItem, order, option_queries as option, servingLocation, misc, account, subscribe$1 as subscribe, file_queries as file, file_queries as util };
