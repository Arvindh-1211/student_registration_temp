import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";

import applicationNoReducer from './applicationNoSlice'
import authReducer from './authSlice'


const persistConfig = {
	key: "root",
	version: 1,
	storage: storage,
}

const reducers = combineReducers({
	applicationNo: applicationNoReducer,
	auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

const persistor = persistStore(store);

export { store, persistor }