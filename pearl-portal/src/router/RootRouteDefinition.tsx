import {lazy} from 'react';
import { ReactComponent as LPIcon } from '../assets/icons/LPMenuIcon.svg';
import { ReactComponent as FundsMenuIcon } from "../assets/icons/FundsMenuIcon.svg";
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import {RouteDefinition} from './models';

const LoaderPage = lazy(() => import('../pages/main/LoaderPage'));
const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const LPsOverview = lazy(() => import('../pages/lps/summary/LPsOverviewPage'));
const FundsOverview = lazy(() => import('../pages/funds/summary/FundsOverviewPage'));
const PCOsOverview = lazy(() => import('../pages/pcos/summary/PCOsOverviewPage'));
const SingleLP = lazy(() => import('../pages/lps/single/SingleLPPage'));
const SingleFund = lazy(() => import('../pages/funds/single/SingleFundPage'));
const SinglePCO = lazy(() => import('../pages/pcos/single/SinglePCOPage'));
const Settings = lazy(() => import('../pages/settings/SettingsMainPage'));

const HomeIconComponent=()=>{
    return <HomeIcon sx={{ fontSize: '32px',color: '#F3F3F3' }}/>
}

const SettingsIconComponent=()=>{
    return <SettingsIcon sx={{ fontSize: '32px',color: '#F3F3F3' }}/>
}

const BusinessIconComponent=()=>{
    return <BusinessIcon sx={{ fontSize: '32px',color: '#F3F3F3' }}/>
}

const LPIconComponent=()=>{
    return <LPIcon fill={'#F3F3F3'}/>
}

export const RootRouteDefinition: RouteDefinition = {
    path: '', children: [{
        path: '/', name: 'Home', page: LandingPage, icon: HomeIconComponent
    }, 
     {
        path: '/lpsOverview', name: 'LPs', icon: LPIconComponent, page:LPsOverview, children: [{
            path: '/lpsOverview/singleLP',
            name: 'Single LP',
            page: SingleLP,
            icon: LPIconComponent,
        }]
    }, {
        path: '/fundsOverview', name: 'Funds', page:FundsOverview, icon: FundsMenuIcon, children: [{
            path: '/fundsOverview/singleFund',
            name: 'Single Fund',
            page: SingleFund,
            icon: FundsMenuIcon,
        }]
    }, {
        path: '/pcosOverview', name: 'PCOs', page:PCOsOverview, icon: BusinessIconComponent, children: [{
            path: '/pcosOverview/singlePCO',
            name: 'Single PCO',
            page: SinglePCO,
            icon: BusinessIcon,
        }]
    },
        {
            path: '/settings', name: 'Settings', page: Settings, icon: SettingsIconComponent,
        }]
};
