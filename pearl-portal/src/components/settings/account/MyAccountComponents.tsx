import {Avatar, Divider, Grid,IconButton,Paper,Typography} from '@mui/material';
import {useTheme} from "@mui/material/styles";
import { useEffect } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import {ReactComponent as UploadPicIcon} from "../../../assets/icons/UploadPicIcon.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatarDiv: {
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        },
        trashBtn: {
            'width': '3em',
            'height': '20px',
            'marginLeft': '5px',
            'color': theme.palette.text.primary,
            'cursor': 'pointer',
            'border': 'none',
            'borderRadius': '0',
            'textTransform': 'none',
            '&:hover': {
                // backgroundColor: theme.palette.text.primary,
                color: theme.palette.warning.main
            },
            'fontSize': 'small'
        },
        uploadBtn: {
            'border': 'none',
            'borderRadius': 0,
            'fontWeight': 600,
            'fontSize': 12,
            'backgroundColor': theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#adb5bd',
            'textTransform': 'none',
            'color': 'rgba(52, 52, 52, 1)',
            '&:hover': {
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(52, 52, 52, 1)',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'lightGray'
            }
        },
        summary: {
            display:'flex',
            flex:1,
            justifyContent:'flex-start',
            alignItems:'flex-start',
            flexDirection:'row',
            width:'100%',
            height:'100%',
            backgroundColor:'red'
        },
    }),
);

const avatarStyles = makeStyles((theme: Theme) => ({
    // root class for the avatar
    root: {
        color: theme.palette.warning.main,
        height: '2em',
        width: '2em',
        background: theme.palette.mode === 'dark' ? '#757575' : theme.palette.grey[100]
    }
}));

const MyAccount = () => {
    const classes=useStyles();
    const avatarClasses = avatarStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();

    
    return (
        <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={1}>
        <Grid item sx={{marginLeft:'1em'}}>
        <Grid container justifyContent="center" >
            <IconButton size="large">
            <AccountCircleIcon sx={{fontSize:'100px', color:theme.palette.primary.main}}/>
            </IconButton>
            </Grid>
        </Grid>
        <Grid item sx={{marginLeft:'1em'}}>
            <Grid container justifyContent={"center"} alignItems="center" spacing={1}>
            <Grid item>
            <Button variant='outlined'
                    sx={{fontFamily:'Raleway', 
                    height:'36px', 
                    textTransform:'none', 
                    backgroundColor:theme.palette.background.paper, 
                    border:`1px solid ${theme.palette.primary.main}`,
                color:theme.palette.primary.main}}
                    startIcon={<UploadPicIcon />}>
                    Upload a picture
                    </Button>
            </Grid>
            <Grid item>
            <IconButton disabled={true}>
                <DeleteIcon/>
                </IconButton>
            </Grid>
            </Grid>
        </Grid>
        <Grid item sx={{width:'100%'}}>
        <Divider sx={{marginTop:'1em', width:'100%'}} />
        </Grid>
        <Grid item sx={{width:'100%',marginLeft:'1em'}}>
            <Grid container>
                <Typography variant='body2' sx={{color:theme.palette.secondary.main, fontWeight:400}}>Full Name</Typography>
            </Grid>
            <Grid container>
                <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:500}}>Jane Doe</Typography>
            </Grid>
        </Grid>
        <Grid item sx={{width:'100%',marginLeft:'1em'}}>
            <Grid container>
                <Typography variant='body2' sx={{color:theme.palette.secondary.main, fontWeight:400}}>Email</Typography>
            </Grid>
            <Grid container>
                <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:500}}>jane.doe@test.com</Typography>
            </Grid>
        </Grid>
        <Grid item sx={{width:'100%',marginLeft:'1em'}}>
            <Grid container>
                <Typography variant='body2' sx={{color:theme.palette.secondary.main, fontWeight:400}}>Phone</Typography>
            </Grid>
            <Grid container>
                <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:500}}>{'+411232324'}</Typography>
            </Grid>
        </Grid>
    </Grid>)
    
};

export default MyAccount;

            {/* <Grid container sx={{display:'flex',flex:1, justifyContent:'flex-start', alignItems:'flex-start', flexDirection:'column', height:'100%', width:'100%'}}>
                <Grid container item xs={4} md={4} lg={4} >
                    <Grid item>
                        <AccountCircleIcon sx={{fontSize:'44px', color:theme.palette.primary.main}}/>
                    </Grid> 
                    <Grid item>
                        <Button variant='outlined'
                        sx={{fontFamily:'Raleway'}}
                        startIcon={<UploadPicIcon/>}>
                        Upload a picture
                        </Button>
                        <DeleteIcon/>
                     </Grid>                 
                </Grid>
                <Grid container item xs={8} md={8} lg={8}>
                <Grid item>
                        <AccountCircleIcon sx={{fontSize:'44px', color:theme.palette.primary.main}}/>
                    </Grid> 
                    <Grid item>
                        <Button variant='outlined'
                        sx={{fontFamily:'Raleway'}}
                        startIcon={<UploadPicIcon/>}>
                        Upload a picture
                        </Button>
                        <DeleteIcon/>
                     </Grid>                 
                </Grid>
            </Grid> */}


           /*  <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <Grid item >
            <Grid container justifyContent="center" >
                <IconButton>
                <AccountCircleIcon sx={{fontSize:'44px', color:theme.palette.primary.main}}/>
                </IconButton>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container justifyContent={"center"} spacing={2}>
                <Grid item>
                <Button variant='outlined'
                        sx={{fontFamily:'Raleway'}}
                        startIcon={<UploadPicIcon/>}>
                        Upload a picture
                        </Button>
                </Grid>
                <Grid item>
                    <DeleteIcon/>
                </Grid>
                </Grid>
            </Grid>
        </Grid> */