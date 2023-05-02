import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainState {
    drawerOpen: boolean;
    isDarkTheme: boolean;
    topBarTitle: string;
    userName: string;
    activePath: string;
    errorMessage?: string;
    navLinkStatePaths: any;
    addDialogOpen: boolean;
    editDialogOpen: boolean;
    editChildDialogOpen: boolean,
    downloadDialogOpen: boolean
}

const initialState: MainState = {
    drawerOpen: false,
    isDarkTheme: false,
    topBarTitle: 'Dashboard',
    userName: 'Jane Doe',
    activePath: '',
    navLinkStatePaths: {},
    addDialogOpen: false,
    editDialogOpen: false,
    editChildDialogOpen: false,
    downloadDialogOpen:false
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
        setNavLinkStatePaths(state, action: PayloadAction<string>) {
            const prevState = state.navLinkStatePaths;
            const item = action.payload;
            state.navLinkStatePaths = { ...prevState, [item]: !prevState[item] };
        },
        /**
         * Set's if the add dialog is open
         * @param state
         * @param action
         */
        setAddDiaogOpen(state, action: PayloadAction<boolean>) {
            state.addDialogOpen = action.payload;
        },
        /**
         * Set's if the add dialog is open
         * @param state
         * @param action
         */
        setEditDiaogOpen(state, action: PayloadAction<boolean>) {
            state.editDialogOpen = action.payload;
        },
        setEditChildDiaogOpen(state, action: PayloadAction<boolean>) {
            state.editChildDialogOpen = action.payload;
        },
        setDownloadDiaogOpen(state, action: PayloadAction<boolean>) {
            state.downloadDialogOpen = action.payload;
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
    setNavLinkStatePaths,
    setAddDiaogOpen,
    setEditDiaogOpen,
    setEditChildDiaogOpen,
    setDownloadDiaogOpen
} = appSlice.actions;

export default appSlice.reducer;