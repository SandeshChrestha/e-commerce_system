import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import futsalCourtReducer from './slices/futsalCourtSlice';
import orderReducer from './slices/orderSlice';
import bookingReducer from './slices/bookingSlice';
import applicationReducer from './slices/applicationSlice';
import favoriteReducer from './slices/favoriteSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
    futsalCourt: futsalCourtReducer,
    order: orderReducer,
    booking: bookingReducer,
    application: applicationReducer,
    favorite: favoriteReducer,
  },
});

export default store; 