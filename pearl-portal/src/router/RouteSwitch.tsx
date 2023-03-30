import React, {Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {RootRouteDefinition} from './RootRouteDefinition';
import {RouteDefinition} from './models';
import LoaderPage from '../pages/main/LoaderPage';

const flatten = (route: RouteDefinition): RouteDefinition[] => {
    let routes:any = [];
    if (route.page) {
        routes = routes.concat(route);
    }

    if (route.children && route.children.length > 0) {
        routes = routes.concat(...route.children.map((r) => {
            return flatten(r);
        }),);
    }

    return routes;
};

const flattenRoutes = flatten(RootRouteDefinition);

/* export const canAccessRoute = (profile: Profile, route: RouteDefinition): boolean => {
    if (route.roles) {
        const userRole = profile['role'];
        if (userRole) {
            if (Array.isArray(userRole)) {
                const match = route.roles.filter(x => userRole.includes(x));
                return match.length > 0;
            } else {
                const found = route.roles.find(x => userRole === x);
                return found !== undefined && found?.length > 0;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}; */


export const RoutesSwitch = (): JSX.Element => {
    return (<Suspense fallback={<LoaderPage/>}>
        <Routes>
            {flattenRoutes.map((route: any) => (<Route
                key={route}
                path={route.path}
                element={<route.page/>}
            />))}
           {/*  <Route path="/403" element={<ForbiddenPage/>}/>
            <Route path="/404" element={<NotFoundPage/>}/>
            <Route path="/500" element={<ErrorPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/> */}
        </Routes>
    </Suspense>);
};
