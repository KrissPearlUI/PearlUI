import { Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import MyAccount from '../../components/settings/account/MyAccountComponents';
import Appearence from '../../components/settings/appearences/AppearenceComponent';
import Users from '../../components/settings/users/UsersComponent';
import { SettingsType } from '../../models/settings/settingsModels';
import { setActivePath, setTopBarTitle } from '../../redux/slices/appSlice';
import { useAppDispatch } from '../../redux/store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ReactComponent as AppearanceIcon } from '../../assets/icons/AppearanceIcon.svg';
import { ReactComponent as UsersIcon } from '../../assets/icons/UsersIcon.svg';

const tabs = [
    { key: SettingsType.Account, url: 'My Account' },
    { key: SettingsType.Appearance, url: 'Appearance' },
    { key: SettingsType.Users, url: 'Users' }];

const Settings = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [selectedType, setSelectedType] = useState<SettingsType>(SettingsType.Account);

    const handeChangeType = (event: any) => {
        setSelectedType(event);
    }


    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Settings"));
        dispatch(setActivePath('/settings'));
    }, [dispatch])

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1, overflow: 'hidden' }}>
            <Grid item xs={4} md={2} lg={2} sx={{ height: '100%', overflow: 'hidden' }}>
                <Box height={'100%'}
                    width={'100%'}
                    position={'static'}
                    sx={{ backgroundColor: theme.palette.background.paper }}>
                    <List sx={{ paddingTop: 0 }}>
                        {tabs?.map((tab, index) => (
                            <ListItem key={tab.key} disablePadding sx={{ display: 'block', marginBottom: '0.5em' }}
                                onClick={() => handeChangeType(tab.key)}
                                aria-label={tab.key}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: 'center',
                                        backgroundColor: tab.key === selectedType ? theme.palette.mode === 'light' ? 'rgba(37, 96, 126, 0.2)' : 'rgba(128, 192, 128,0.4)' : 'transparent',
                                        px: 2.5,
                                        cursor: 'pointer'
                                    }}>
                                    <ListItemIcon
                                        sx={{
                                            color: '#F3F3F3',
                                            minWidth: 0,
                                            mr: 3,
                                            justifyContent: 'center',
                                        }}>
                                        {
                                            index % 3 === 0 ? <AccountCircleIcon sx={{ fontSize: '32px', color: theme.palette.text.primary }} />
                                                : tab.key === SettingsType.Appearance ? <AppearanceIcon fill={theme.palette.text.primary} />
                                                    : <UsersIcon fill={theme.palette.text.primary} />
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={tab.url}/>

                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Grid>
            <Grid item xs={8} md={10} lg={10} sx={{ height: '100%', overflow: 'hidden' }}>
                {selectedType === SettingsType.Account ? <MyAccount />
                    : selectedType === SettingsType.Appearance ? <Appearence />
                        : <Users />}
            </Grid>

        </Grid>
    );
};

export default Settings;