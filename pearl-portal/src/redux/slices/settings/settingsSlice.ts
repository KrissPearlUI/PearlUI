import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LP, PCOExtended } from '../../../models/lps/lpModels';

export interface SettingsState {
    editAddInternalUserDialogOpen: boolean
    selectedUser: any,
    deleteConfirmDialogOpen: boolean,
    inviteExternalDialogOpen: boolean
}

const initialState: SettingsState = {
    editAddInternalUserDialogOpen: false,
    selectedUser: null,
    deleteConfirmDialogOpen: false,
    inviteExternalDialogOpen: false
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setEditAddInternalUserDialogOpen(state, action: PayloadAction<boolean>) {
            state.editAddInternalUserDialogOpen = action.payload;
        },
        /**
         * Set's the selected user to be added or modified
         * @param state
         * @param action
         */
        setSelectedUser(state, action: PayloadAction<any>) {
            state.selectedUser = action.payload;
        },
        setDeleteConfirmDialogOpen(state, action: PayloadAction<boolean>) {
            state.deleteConfirmDialogOpen = action.payload;
        },
        setinviteExternalDialogOpen(state, action: PayloadAction<boolean>) {
            state.inviteExternalDialogOpen = action.payload;
        },
    }
});

export const {
    setEditAddInternalUserDialogOpen,
    setSelectedUser,
    setDeleteConfirmDialogOpen,
    setinviteExternalDialogOpen
} = settingsSlice.actions;

export default settingsSlice.reducer;