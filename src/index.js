import * as miscQueries from './misc.queries';
import * as miscMutations from './misc.mutations';
const misc = {...miscQueries, ...miscMutations};

import * as accountFragments from './account/account.fragments';
import * as accountMutations from './account/account.mutations';
import * as accountQueries from './account/account.queries';
const account = {...accountFragments, ...accountQueries, ...accountMutations};

import * as menuItemMutations from './restaurant/menuItem.mutations';
import * as menuItemQueries from './restaurant/menuItem.queries';
const menuItem = {...menuItemQueries, ...menuItemMutations};

import * as orderMutations from './restaurant/order.mutations';
import * as orderQueries from './restaurant/order.queries';
const order = {...orderQueries, ...orderMutations};

import * as menuMutations from './restaurant/menu.mutations';
import * as menuQueries from './restaurant/menu.queries';
const menu = {...menuQueries, ...menuMutations};

import * as servingLocationMutations from './restaurant/servingLocation.mutations';
import * as servingLocationQueries from './restaurant/servingLocation.queries';
const servingLocation = {...servingLocationQueries, ...servingLocationMutations};

import * as restaurantMutations from './restaurant/restaurant.mutations';
import * as restaurantQueries from './restaurant/restaurant.queries';
const restaurant = {...restaurantQueries, ...restaurantMutations};

import * as option from './restaurant/option.queries';
import subscribe from './subscribe';
import * as file from './file.queries';
import * as util from './util';

export {
  restaurant,
  menu,
  menuItem,
  order,
  option,
  servingLocation,
  misc,
  account,
  subscribe,
  file,
  util
};

