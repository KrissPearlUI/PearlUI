import appReducer from './appSlice';
import lpsReducer from './lps/lpsSlice';
import {combineReducers} from '@reduxjs/toolkit';

const rootSlice = combineReducers({
    app: appReducer,
    lps:lpsReducer,
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
