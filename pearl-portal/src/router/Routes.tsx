import React, {Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import LoaderPage from '../pages/main/LoaderPage';
import LandingPage from "../pages/landing/LandingPage";
import LPsOverview from '../pages/lps/summary/LPsOverviewPage';
import FundsOverview from '../pages/funds/summary/FundsOverviewPage';
import PCOsOverview from '../pages/pcos/summary/PCOsOverviewPage';
import Settings from '../pages/settings/SettingsMainPage';
import SingleLP from '../pages/lps/single/SingleLPPage';

export const RoutesSwitch = () => {
    return (
        <Suspense fallback={<LoaderPage/>}>
            <Routes>
                <Route path={'/'} element={<LandingPage/>}/>
                <Route path={'/lpsOverview'} element={<LPsOverview/>}/>
                <Route path={'/lpsOverview/singleLP'} element={<SingleLP/>}/>
                <Route path={'/fundsOverview'} element={<FundsOverview/>}/>
                <Route path={'/pcosOverview'} element={<PCOsOverview/>}/>
                <Route path={'/settings'} element={<Settings/>}/>
            </Routes>
        </Suspense>
    );
};

