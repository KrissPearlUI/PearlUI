import appReducer from './appSlice';
import lpsReducer from './lps/lpsSlice';
import fundsReducer from './funds/fundsSlice';
import pcosReducer from './pcos/pcosSlice';
import {combineReducers} from '@reduxjs/toolkit';

const rootSlice = combineReducers({
    app: appReducer,
    lps:lpsReducer,
    funds:fundsReducer,
    pcos:pcosReducer
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
