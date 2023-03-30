import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainState {
    drawerOpen: boolean;
    isDarkTheme: boolean;
    topBarTitle: string;
    userName: string;
    activePath: string;
    errorMessage?: string;
    navLinkState: any;
}

const initialState: MainState = {
    drawerOpen: false,
    isDarkTheme: false,
    topBarTitle: 'Dashboard',
    userName: 'Jane Doe',
    activePath: '/',
    navLinkState: {},
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        /**
         * Set's the theme of the application. If true is dark theme if false is light theme
         * @param state
         * @param action
         */
        setIsDarkTheme(state, action: PayloadAction<boolean>) {
            state.isDarkTheme = action.payload;
        },
        /**
         * Set's if the drawer is open
         * @param state
         * @param action
         */
        setIsDrawerOpen(state, action: PayloadAction<boolean>) {
            state.drawerOpen = action.payload;
        },
        /**
         * Set's the title that is displayed in the topBar
         * @param state
         * @param action
         */
        setTopBarTitle(state, action: PayloadAction<string>) {
            state.topBarTitle = action.payload;
        },
        /**
        * Set's the current logged in user name and last name
        * @param state
        * @param action
        */
        setUserName(state, action: PayloadAction<string>) {
            state.userName = action.payload;
        },
        /**
        * Set's the current page url
        * @param state
        * @param action
        */
        setActivePath(state, action: PayloadAction<string>) {
            state.activePath = action.payload;
        },
        /**
         * Set's the error message
         * @param state
         * @param action
         */
        setErrorMessage(state, action: PayloadAction<string>) {
            state.errorMessage = action.payload;
        },
        setNavLinkState(state, action: PayloadAction<string>) {
            const prevState = state.navLinkState;
            const item = action.payload;
            state.navLinkState = {...prevState, [item]: !prevState[item]};
        },
    }
});

export const {
    setIsDarkTheme,
    setIsDrawerOpen,
    setTopBarTitle,
    setUserName,
    setActivePath,
    setErrorMessage,
    setNavLinkState
} = appSlice.actions;

export default appSlice.reducer;