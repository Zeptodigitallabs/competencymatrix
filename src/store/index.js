import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','user'] // only auth will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with middleware
const middleware = [thunk];

// Create the store
const store = createStore(
  persistedReducer,
  applyMiddleware(...middleware)
);

// Create the persistor
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };

export default {
  store,
  persistor
};
