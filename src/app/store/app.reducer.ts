import {Action, ActionReducerMap} from "@ngrx/store";

import * as fromShoppingList from '../modules/shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../core/auth/store/auth.reducer';

/* Global application state structure */
export interface AppState {
  shoppingList: fromShoppingList.ShoppingListState,
  auth: fromAuth.AuthState
}

/* Global application reducers */
export const reducers: ActionReducerMap<any, Action> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer
}

/*
 * The AppState interface will define how the application state will look like, this is useful for when we inject the
 * store into components and services and need to them, via generic, how the store is supposed to be structured
 *  - constructor(private store: Store<fromApp.AppState>) { }
 *
 * The reducers is an Map were we can tell the NgRx Store what reducers our application will use, so whenever an action
 * is dispatched, they will go through them. This Map is passed as parameter when building up the StoreModule in
 * AppModule
 *  - StoreModule.forRoot(fromApp.reducers)
 */
