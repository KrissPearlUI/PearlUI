import {Avatar, Button, Divider, Grid,IconButton,Paper,Typography} from '@mui/material';
import {darken, useTheme} from "@mui/material/styles";
import { useEffect } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../landing/LPChart';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
        summary: {
            flex:1
        },
    }),
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.mode==='light'? theme.palette.grey[400] : theme.palette.grey[800],
      fontFamily:'Raleway',
      color: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
      fontFamily:'Raleway',
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& .MuiTableRow-root': {
        height: '20px', // set the height to your desired value
      },
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const adminRows = [
    {
        id: '1',
        name:'Hans Dellenbach', 
        email: 'hans.dellenbach@emerald.vc',
        role: 'Admin',
        dateAdded: '05/10/2006', 
        picURL:'../../hans.jpg'
        
    },
    {
        id: '2',
        name:'Marta Jerica', 
        email: 'marta.jerica@emerald.vc',
        role: 'Admin',
        dateAdded: '23/11/2019', 
        picURL:'../../marta.jpg'  
    },
    {
        id: '3',
        name:'Stefan Riechsteiner', 
        email: 'stefan.riechsteinerd@emerald.vc',
        role: 'Admin',
        dateAdded: '15/04/2017', 
        picURL:'../../stefan.jpg'  
    },
    {
        id: '4',
        name:'Michael Zehnder', 
        email: 'michael.zehnder@emerald.vc',
        role: 'Admin',
        dateAdded: '22/09/2022', 
        picURL:'../../michael.jpg'  
    },
    
];

const accountRows = [
    {
        id: '1',
        name:'Alex Mercandetti', 
        email: 'alex.mercandetti@emerald.vc',
        role: 'Viewer',
        picURL:'../../alexM.jpg'
        
    },
    {
        id: '2',
        name:'Annina Winkler', 
        email: 'annina.winkler@emerald.vc',
        role: 'Viewer',
        picURL:'../../anninaW.jpg'  
    },
    {
        id: '3',
        name:'Clayton MacDougald', 
        email: 'clayton.macdougald@emerald.vc',
        role: 'Viewer',
        picURL:'../../claytonM.jpg'  
    },
    {
        id: '4',
        name:'Jessyca Wyss', 
        email: 'jessyca.wyss@emerald.vc',
        role: 'Viewer',
        picURL:'../../jessyceW.jpg'  
    },
    {
        id: '5',
        name:'Isabelle Panto', 
        email: 'isabelle.panto@emerald.vc',
        role: 'Viewer',
        picURL:'../../isabelleP.jpg'  
    },
    {
        id: '6',
        name:'Madjiguène Ndiaye', 
        email: 'madjiguène.ndiaye@emerald.vc',
        role: 'Viewer',
        picURL:'../../madjigueneN.jpg'  
    },
    {
        id: '7',
        name:'Max Hefti', 
        email: 'max.hefti@emerald.vc',
        role: 'Viewer',
        picURL:'../../maxH.jpg'  
    },
    {
        id: '8',
        name:'Simone Riedel Riley', 
        email: 'simone.riedel@emerald.vc',
        role: 'Viewer',
        picURL:'../../simoneR.jpg'  
    },
    
];
  
const Users = () => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();

    
    return (
        <Grid container sx={{display:'flex',flex:1, justifyContent:'space-betweeen', alignItems:'flex-start', flexDirection:'row', marginLeft:'1em', overflow:'hidden'}}>
            <Grid container sx={{display:'flex',flex:1, justifyContent:'space-betweeen', alignItems:'center', flexDirection:'row',}}>
                <Grid item xs={6} md={6} lg={6} className={classes.summary}>
                    <Grid container>
                        <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Team Members</Typography>
                    </Grid>
                    <Grid container>
                        <Typography variant='body2' sx={{color:theme.palette.mode==='light'?'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary,0.4), fontWeight:400, fontSize:'14px'}}>View and manage your team meberes</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6} md={6} lg={6} sx={{display:'flex', justifyContent:'end',alignItems:'center',paddingRight:'2em'}}>
                <Button variant='outlined'
                    sx={{fontFamily:'Raleway', 
                    height:'36px', 
                    textTransform:'none', 
                    alignSelf:'center',
                    backgroundColor:theme.palette.background.paper, 
                    border:`1px solid ${theme.palette.primary.main}`,
                color:theme.palette.primary.main}}
                    startIcon={<AddIcon />}>
                    Add team member
                    </Button>
                </Grid>
            </Grid>
            <Grid item sx={{width:'100%', marginTop:'1em', marginBottom:'1em'}}>
                <Divider/>
            </Grid>
            <Grid container sx={{display:'flex',flex:1, justifyContent:'space-betweeen', alignItems:'flex-start', flexDirection:'row'}}>
            <Grid item xs={4} md={4} lg={4} className={classes.summary} >
                    <Grid container>
                        <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Admin Users</Typography>
                    </Grid>
                    <Grid container>
                        <Typography variant='body2' 
                        sx={{color:theme.palette.mode==='light'?'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary,0.4), fontWeight:400, fontSize:'14px'}}>
                            Admins can add, edit and remove other users, as well as data in the app
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={8} md={8} lg={8} sx={{display:'flex', justifyContent:'end', paddingRight:'2em'}}>
                    <TableContainer component={Paper} sx={{ maxHeight: 280, maxWidth:700 }}>
                        <Table stickyHeader aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">Role</StyledTableCell>
                                <StyledTableCell align="left">Date Added</StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {adminRows.map((row) => (
                                <StyledTableRow key={row.name}>
                                <StyledTableCell align="left">
                                    <Grid container sx={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                                        <Grid item>
                                            <Avatar alt={row.name} src={row.picURL} />
                                        </Grid>
                                        <Grid item sx={{marginLeft:'1em'}}>
                                            <Grid container>
                                                {row.name}
                                            </Grid>
                                            <Grid container sx={{color:theme.palette.text.primary,opacity:'0.7'}}>
                                                {row.email}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.role}</StyledTableCell>
                                <StyledTableCell align="left">{row.dateAdded}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <Grid container sx={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                                            <Grid item>
                                                <IconButton >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Grid>
                                            <Grid item sx={{marginLeft:'1em'}}>
                                                <IconButton >
                                                    <EditIcon/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid item sx={{width:'100%', marginTop:'1em', marginBottom:'1em'}}>
                <Divider/>
            </Grid>
            <Grid container sx={{display:'flex',flex:1, justifyContent:'space-betweeen', alignItems:'flex-start', flexDirection:'row'}}>
            <Grid item xs={4} md={4} lg={4} className={classes.summary}>
                    <Grid container>
                        <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Account Users</Typography>
                    </Grid>
                    <Grid container>
                        <Typography variant='body2' 
                        sx={{color:theme.palette.mode==='light'?'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary,0.4), fontWeight:400, fontSize:'14px'}}>
                            List of all internal users that admin users can invite
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={8} md={8} lg={8} sx={{display:'flex', justifyContent:'end', paddingRight:'2em'}}>
                    <TableContainer component={Paper} sx={{ maxHeight: 280,maxWidth:700  }}>
                        <Table stickyHeader aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">Role</StyledTableCell>
                                <StyledTableCell align="left">Invite User</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {accountRows.map((row) => (
                                <StyledTableRow key={row.name}>
                                <StyledTableCell align="left">
                                    <Grid container sx={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                                        <Grid item>
                                            <Avatar alt={row.name} src={row.picURL} />
                                        </Grid>
                                        <Grid item sx={{marginLeft:'1em'}}>
                                            <Grid container>
                                                {row.name}
                                            </Grid>
                                            <Grid container sx={{color:theme.palette.text.primary,opacity:'0.7'}}>
                                                {row.email}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.role}</StyledTableCell>
                                <StyledTableCell align="right">
                                <Button variant='contained'
                                    sx={{fontFamily:'Raleway', 
                                    height:'36px', 
                                    textTransform:'none', 
                                    backgroundColor:theme.palette.secondary.main, 
                                    //border:`1px solid ${theme.palette.primary.main}`,
                                    color:'white'}}
                                    startIcon={<PersonAddAlt1Icon />}>
                                    Invite
                                    </Button>
                                </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
         </Grid>
    );
};

export default Users;