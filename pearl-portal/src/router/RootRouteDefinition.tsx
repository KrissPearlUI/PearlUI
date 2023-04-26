import { lazy } from 'react';
import { ReactComponent as LPIcon } from '../assets/icons/LPMenuIcon.svg';
import { ReactComponent as FundsMenuIcon } from "../assets/icons/FundsMenuIcon.svg";
import { ReactComponent as SingleLP } from '../assets/icons/SingleLPIcon.svg';
import { ReactComponent as SingleFund } from '../assets/icons/SingleFundIcon.svg';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import { RouteDefinition } from './models';

const LoaderPage = lazy(() => import('../pages/main/LoaderPage'));
const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const LPsOverview = lazy(() => import('../pages/lps/summary/LPsOverviewPage'));
const FundsOverview = lazy(() => import('../pages/funds/summary/FundsOverviewPage'));
const PCOsOverview = lazy(() => import('../pages/pcos/summary/PCOsOverviewPage'));
const SingleLPPage = lazy(() => import('../pages/lps/single/SingleLPPage'));
const SingleFundPage = lazy(() => import('../pages/funds/single/SingleFundPage'));
const SinglePCOPage = lazy(() => import('../pages/pcos/single/SinglePCOPage'));
const Settings = lazy(() => import('../pages/settings/SettingsMainPage'));

const HomeIconComponent = () => {
    return <HomeIcon sx={{ fontSize: '32px', color: '#F3F3F3' }} />
}

const SettingsIconComponent = () => {
    return <SettingsIcon sx={{ fontSize: '32px', color: '#F3F3F3' }} />
}

const BusinessIconComponent = () => {
    return <BusinessIcon sx={{ fontSize: '32px', color: '#F3F3F3' }} />
}

const SinglePCOIconComponent = () => {
    return <StoreIcon sx={{ fontSize: '32px', color: '#F3F3F3' }} />
}

const LPIconComponent = () => {
    return <LPIcon fill={'#F3F3F3'} />
}

const SingleLPIconComponent = () => {
    return <SingleLP fill={'#F3F3F3'} />
}

const SingleFundIconComponent = () => {
    return <SingleFund fill={'#F3F3F3'} />
}

export const RootRouteDefinition: RouteDefinition = {
    path: '', children: [{
        path: '/', name: 'Home', page: LandingPage, icon: HomeIconComponent, isChildren: false
    },
    {
        path: '/lpsOverview', name: 'LPs', icon: LPIconComponent, page: LPsOverview, isChildren: false,
    }, {
        path: '/fundsOverview', name: 'Funds', page: FundsOverview, icon: FundsMenuIcon, isChildren: false,
    }, {
        path: '/pcosOverview', name: 'PCOs', page: PCOsOverview, icon: BusinessIconComponent, isChildren: false,
    },
    {
        path: '/settings', name: 'Settings', page: Settings, icon: SettingsIconComponent, isChildren: false
    }]
};
