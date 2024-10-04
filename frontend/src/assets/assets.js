import citiesData from './citiesData.json'
import logo from './logo.webp'
import hero from './hero.webp'
import hero_mobile from './hero_mobile.webp'
import leaf_1 from './leaf_1.webp'
import leaf_2 from './leaf_2.webp'
import leaf_3 from './leaf_3.webp'
import leaf_4 from './leaf_4.webp'

import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'

import chef_1 from './chef_1.webp'
import chef_2 from './chef_2.webp'
import chef_3 from './chef_3.webp'
import delivery_icon_128 from './delivery_icon_128.webp'
import healthy_food_128 from './healthy_food_128.webp'
import best_quality_128 from './best_quality_128.webp'
import dish_mobile from './dish_mobile.webp'
import empty_orders from './empty_orders.webp'
import honey_bg from './honey_bg.webp'
import barbeque_bg from './barbeque_bg.webp'
import empty_cart from './empty_cart.webp'
import order_placed_failed from './order_placed_failed.webp'
import order_placed_success from './order_placed_success.webp'
import page_not_found from './page_not_found.webp'


import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import linkedin_icon from './linkedin_icon.webp'
import facebook_icon from './facebook_icon.webp'
import twitter_icon from './twitter_icon.webp'
import rating_starts from './rating_starts.png'
import parcel_icon from './parcel_icon.png'

export const assets = {
    logo,
    hero,
    hero_mobile,
    leaf_1,
    leaf_2,
    leaf_3,
    leaf_4,
    dish_mobile,
    empty_orders,
    chef_1,
    chef_2,
    chef_3,
    honey_bg,
    barbeque_bg,
    empty_cart,
    order_placed_success,
    order_placed_failed,
    page_not_found,
    delivery_icon_128,
    healthy_food_128,
    best_quality_128,
    rating_starts,
    add_icon_green,
    remove_icon_red,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    parcel_icon
}

export const menu_list = [
    {
        menu_name: "Salad",
        menu_image: menu_1
    },
    {
        menu_name: "Rolls",
        menu_image: menu_2
    },
    {
        menu_name: "Deserts",
        menu_image: menu_3
    },
    {
        menu_name: "Sandwich",
        menu_image: menu_4
    },
    {
        menu_name: "Cake",
        menu_image: menu_5
    },
    {
        menu_name: "Pure Veg",
        menu_image: menu_6
    },
    {
        menu_name: "Pasta",
        menu_image: menu_7
    },
    {
        menu_name: "Noodles",
        menu_image: menu_8
    }]


export const states = Object.keys(citiesData).map((state) => ({
  value: state,
  label: state,
}));

  
// Generate the cities object
export const cities = Object.fromEntries(
  Object.entries(citiesData).map(([state, cities]) => [
    state,
    cities.map((city) => ({
      value: city,
      label: city,
    })),
  ])
);