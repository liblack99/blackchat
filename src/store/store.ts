import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import messagesReducer from "../slices/messagesSlice";
import friendsReducer from "../slices/friendsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    friends: friendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
