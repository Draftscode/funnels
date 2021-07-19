// src/app/store/reducer.ts

import { ActionsUnion, ActionTypes, Product } from "../actions/action";


export const initialState: { items: Product[]; cart: Product[] } = {
    items: [],
    cart: []
};

export function ShopReducer(state = initialState, action: ActionsUnion) {
    switch (action.type) {
        case ActionTypes.LoadSuccess:
            return {
                ...state,
                items: [...action.payload]
            };

        case ActionTypes.Add:
            return {
                ...state,
                cart: [...state.cart, action.payload]
            };

        case ActionTypes.Remove:
            return {
                ...state,
                cart: [...state.cart.filter((item) => item.name !== action.payload.name)]
            };

        default:
            return state;
    }
}