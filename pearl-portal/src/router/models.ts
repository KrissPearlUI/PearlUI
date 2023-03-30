export interface RouteDefinition {
    path: string;
    name?: string;
    page?: any;
    icon?: any;
    open?: boolean;
    roles?: string[];
    children?: RouteDefinition[];
    accounts?: string[];
    isChildren?: boolean
}