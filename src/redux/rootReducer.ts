import { combineReducers } from "@reduxjs/toolkit";
import playersSlice from "./features/playersSlice";
const rootReducer = combineReducers({
  players: playersSlice,
});

export default rootReducer;
