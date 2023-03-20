import appReducer from './appSlice';
import lpsReducer from './lps/lpsSlice';
import fundsReducer from './funds/fundsSlice';
import pcosReducer from './pcos/pcosSlice';
import cashCallsReducer from './cashCalls/cashCallsSlice';
import distributionsReducer from './distributions/distributionsSlice';
import transactionsReducer from './transactions/transactionsSlice';
import {combineReducers} from '@reduxjs/toolkit';

const rootSlice = combineReducers({
    app: appReducer,
    lps:lpsReducer,
    funds:fundsReducer,
    pcos:pcosReducer,
    cashCalls:cashCallsReducer,
    distributions:distributionsReducer,
    transactions:transactionsReducer
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
