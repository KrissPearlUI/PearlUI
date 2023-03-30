import { Avatar, Button, Checkbox, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import { darken, useTheme } from "@mui/material/styles";
import { useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
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
            flex: 1
        },
    }),
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
        fontFamily: 'Raleway',
        color: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
        fontFamily: 'Raleway',
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& .MuiTableRow-root': {
        height: '20px', // set the height to your desired value
    },
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        "&:hover": {
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(37, 96, 126, 0.2)' : 'rgba(128, 192, 128,0.4)'
        }
    },
    '&:nth-of-type(even)': {
        "&:hover": {
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(37, 96, 126, 0.2)' : 'rgba(128, 192, 128,0.4)'
        }
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const adminRows = [
    {
        id: '1',
        name: 'Hans Dellenbach',
        email: 'hans.dellenbach@emerald.vc',
        role: 'Admin',
        dateAdded: '05/10/2006',
        picURL: 'hansD.png'

    },
    {
        id: '2',
        name: 'Marta Jerica',
        email: 'marta.jerica@emerald.vc',
        role: 'Admin',
        dateAdded: '23/11/2019',
        picURL: 'marta.jpg'
    },
    {
        id: '3',
        name: 'Stefan Riechsteiner',
        email: 'stefan.riechsteinerd@emerald.vc',
        role: 'Admin',
        dateAdded: '15/04/2017',
        picURL: 'stefan.jpg'
    },
    {
        id: '4',
        name: 'Michael Zehnder',
        email: 'michael.zehnder@emerald.vc',
        role: 'Admin',
        dateAdded: '22/09/2022',
        picURL: 'michael.jpg'
    },

];

const accountRows = [
    {
        id: '1',
        name: 'Alex Mercandetti',
        email: 'alex.mercandetti@emerald.vc',
        role: 'Viewer',
        picURL: 'alexM.jpg'

    },
    {
        id: '2',
        name: 'Annina Winkler',
        email: 'annina.winkler@emerald.vc',
        role: 'Viewer',
        picURL: 'anninaW.jpg'
    },
    {
        id: '3',
        name: 'Clayton MacDougald',
        email: 'clayton.macdougald@emerald.vc',
        role: 'Viewer',
        picURL: 'claytonM.jpg'
    },
    {
        id: '4',
        name: 'Jessyca Wyss',
        email: 'jessyca.wyss@emerald.vc',
        role: 'Viewer',
        picURL: 'jessicaW.jpg'
    },
    {
        id: '5',
        name: 'Isabelle Panto',
        email: 'isabelle.panto@emerald.vc',
        role: 'Viewer',
        picURL: 'isabelleP.jpg'
    },
    {
        id: '6',
        name: 'Madjiguène Ndiaye',
        email: 'madjiguène.ndiaye@emerald.vc',
        role: 'Viewer',
        picURL: 'madjigueneN.jpg'
    },
    {
        id: '7',
        name: 'Max Hefti',
        email: 'max.hefti@emerald.vc',
        role: 'Viewer',
        picURL: 'maxH.jpg'
    },
    {
        id: '8',
        name: 'Simone Riedel Riley',
        email: 'simone.riedel@emerald.vc',
        role: 'Viewer',
        picURL: 'simoneR.jpg'
    },
    {
        id: '9',
        name: 'Maryam Asadi',
        email: 'maryam.asadi@emerald.vc',
        role: 'Viewer',
        picURL: 'maryamA.jpg'

    },
    {
        id: '10',
        name: 'Frank Balas',
        email: 'frank.balas@emerald.vc',
        role: 'Viewer',
        picURL: 'frankB.jpg'
    },
    {
        id: '11',
        name: 'Thierry Borner',
        email: 'thierry.borner@emerald.vc',
        role: 'Viewer',
        picURL: 'thierryB.png'
    },
    {
        id: '12',
        name: 'Neil Cameron',
        email: 'neil.cameron@emerald.vc',
        role: 'Viewer',
        picURL: 'neilC.jpg'
    },
    {
        id: '13',
        name: 'Graham Carey',
        email: 'graham.carey@emerald.vc',
        role: 'Viewer',
        picURL: 'grahamC.jpg'
    },
    {
        id: '14',
        name: 'Helge Daebel',
        email: 'helge.daebel@emerald.vc',
        role: 'Viewer',
        picURL: 'HelgeD.png'
    },
    {
        id: '15',
        name: 'Pollene Diente',
        email: 'pollene.diente@emerald.vc',
        role: 'Viewer',
        picURL: 'polleneD.jpg'
    },
    {
        id: '16',
        name: 'Julien Dillon',
        email: 'julien.dillon@emerald.vc',
        role: 'Viewer',
        picURL: 'julienD.png'
    },
    {
        id: '17',
        name: 'Gina Domanig',
        email: 'gina.domanig@emerald.vc',
        role: 'Viewer',
        picURL: 'ginaD.png'
    },
    {
        id: '18',
        name: 'Nico Domanig',
        email: 'nico.domanig@emerald.vc',
        role: 'Viewer',
        picURL: 'nicoD.png'
    },
    {
        id: '19',
        name: 'Stacy Fiehler',
        email: 'stacy.fiehler@emerald.vc',
        role: 'Viewer',
        picURL: 'stacyF.jpg'
    },
    {
        id: '20',
        name: 'Christoph Frei',
        email: 'christoph.frei@emerald.vc',
        role: 'Viewer',
        picURL: 'christophF.jpg'
    },
    {
        id: '21',
        name: 'Anandhi Gokhale',
        email: 'anandhi.gokhale@emerald.vc',
        role: 'Viewer',
        picURL: 'anandhiG.png'

    },
    {
        id: '22',
        name: 'Philipp Hasler',
        email: 'philipp.hasler@emerald.vc',
        role: 'Viewer',
        picURL: 'philippH.jpg'
    },
    {
        id: '23',
        name: 'Emmi Kaipio',
        email: 'emmi.kaipio@emerald.vc',
        role: 'Viewer',
        picURL: 'EmmiK.png'
    },
    {
        id: '24',
        name: 'Kelven Lam',
        email: 'Kelven.lam@emerald.vc',
        role: 'Viewer',
        picURL: 'kelvenL.png'
    },
    {
        id: '25',
        name: 'Mariam Lapointe',
        email: 'mariam.lapointe@emerald.vc',
        role: 'Viewer',
        picURL: 'mariamL.jpg'
    },
    {
        id: '26',
        name: 'Martina Looser',
        email: 'martina.looser@emerald.vc',
        role: 'Viewer',
        picURL: 'martinaL.png'
    },
    {
        id: '27',
        name: 'Stephen Marcus',
        email: 'stephen.marcus@emerald.vc',
        role: 'Viewer',
        picURL: 'stephenM.jpg'
    },
    {
        id: '28',
        name: 'Heather McHugh',
        email: 'heather.mchugh@emerald.vc',
        role: 'Viewer',
        picURL: 'heatherM.png'
    },
    {
        id: '29',
        name: 'Markus Moor',
        email: 'markus.moor@emerald.vc',
        role: 'Viewer',
        picURL: 'markusM.jpg'
    },
    {
        id: '30',
        name: 'Tetsuya Mori',
        email: 'tetsuya.mori@emerald.vc',
        role: 'Viewer',
        picURL: 'tetsuyaM.png'
    },
    {
        id: '31',
        name: 'Michal Natora',
        email: 'michal.natora@emerald.vc',
        role: 'Viewer',
        picURL: 'michalN.jpg'
    },
    {
        id: '32',
        name: 'Fredric Petit',
        email: 'fredric.petit@emerald.vc',
        role: 'Viewer',
        picURL: 'fredricP.jpg'
    },
    {
        id: '33',
        name: 'Michael Revensburg',
        email: 'michael.revensburg@emerald.vc',
        role: 'Viewer',
        picURL: 'michaelR.jpg'
    },
    {
        id: '34',
        name: 'Petra Rüegg',
        email: 'petra.ruegg@emerald.vc',
        role: 'Viewer',
        picURL: 'petraR.jpg'
    },
    {
        id: '35',
        name: 'Michèle Schneider',
        email: 'michele.schneider@emerald.vc',
        role: 'Viewer',
        picURL: 'micheleS.jpg'
    },
    {
        id: '36',
        name: 'Jun Da Tan',
        email: 'jun.tan@emerald.vc',
        role: 'Viewer',
        picURL: 'jundaT.png'
    },
    {
        id: '37',
        name: 'Charles Vaslet',
        email: 'charles.vaslet@emerald.vc',
        role: 'Viewer',
        picURL: 'charlesV.png'
    },
    {
        id: '38',
        name: 'Mehran Zaker',
        email: 'mehran.zaker@emerald.vc',
        role: 'Viewer',
        picURL: 'mehranZ.jpg'
    }
];

const Users = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [selected, setSelected] = useState<readonly string[]>([]);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = accountRows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const isSelected = (id: string) => {
        return selected.indexOf(id) !== -1;
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    return (
        <Grid container sx={{ display: 'flex', flex: 1, justifyContent: 'space-betweeen', alignItems: 'flex-start', flexDirection: 'row', marginLeft: '1em', overflow: 'hidden' }}>
            <Grid container sx={{ display: 'flex', flex: 1, justifyContent: 'space-betweeen', alignItems: 'center', flexDirection: 'row', }}>
                <Grid item xs={6} md={6} lg={6} className={classes.summary}>
                    <Grid container>
                        <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Team Members</Typography>
                    </Grid>
                    <Grid container>
                        <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>View and manage your team meberes</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', paddingRight: '2em' }}>
                    <Button variant='outlined'
                        sx={{
                            fontFamily: 'Raleway',
                            height: '36px',
                            textTransform: 'none',
                            alignSelf: 'center',
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.primary.main}`,
                            color: theme.palette.primary.main
                        }}
                        startIcon={<AddIcon />}>
                        Add team member
                    </Button>
                </Grid>
            </Grid>
            <Grid item sx={{ width: '100%', marginTop: '1em', marginBottom: '1em' }}>
                <Divider />
            </Grid>
            <Grid container sx={{ display: 'flex', flex: 1, justifyContent: 'space-betweeen', alignItems: 'flex-start', flexDirection: 'row' }}>
                <Grid item xs={4} md={4} lg={4} className={classes.summary} >
                    <Grid container>
                        <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Admin Users</Typography>
                    </Grid>
                    <Grid container>
                        <Typography variant='body2'
                            sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>
                            Admins can add, edit and remove other users, as well as data in the app
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={8} md={8} lg={8} sx={{ display: 'flex', justifyContent: 'end', paddingRight: '2em' }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 280, maxWidth: 700 }}>
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
                                            <Grid container sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                <Grid item>
                                                    <Avatar alt={row.name} src={`${process.env.PUBLIC_URL}/${row.picURL}`} />
                                                </Grid>
                                                <Grid item sx={{ marginLeft: '1em' }}>
                                                    <Grid container>
                                                        {row.name}
                                                    </Grid>
                                                    <Grid container sx={{ color: theme.palette.text.primary, opacity: '0.7' }}>
                                                        {row.email}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.role}</StyledTableCell>
                                        <StyledTableCell align="left">{row.dateAdded}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Grid container sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                <Grid item>
                                                    <IconButton >
                                                        <DeleteIcon sx={{ color: theme.palette.secondary.main }} />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item sx={{ marginLeft: '1em' }}>
                                                    <IconButton >
                                                        <EditIcon sx={{ color: theme.palette.secondary.main }} />
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
            <Grid item sx={{ width: '100%', marginTop: '1em', marginBottom: '1em' }}>
                <Divider />
            </Grid>
            <Grid container sx={{ display: 'flex', flex: 1, justifyContent: 'space-betweeen', alignItems: 'flex-start', flexDirection: 'row' }}>
                <Grid item xs={4} md={4} lg={4} className={classes.summary}>
                    <Grid container>
                        <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Account Users</Typography>
                    </Grid>
                    <Grid container>
                        <Typography variant='body2'
                            sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>
                            List of all internal users that admin users can invite
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={8} md={8} lg={8} sx={{ display: 'flex', justifyContent: 'end', paddingRight: '2em' }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 280, maxWidth: 700 }}>
                        <Table stickyHeader aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell padding="checkbox">
                                        <Checkbox
                                            color="secondary"
                                            indeterminate={selected.length > 0 && selected.length < accountRows.length}
                                            checked={accountRows.length > 0 && selected.length === accountRows.length}
                                            onChange={handleSelectAllClick}
                                            inputProps={{
                                                'aria-label': 'select all employees',
                                            }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="left">Name</StyledTableCell>
                                    <StyledTableCell align="left">Role</StyledTableCell>
                                    <StyledTableCell align="left">Invite User</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accountRows.map((row) => (
                                    <StyledTableRow key={row.id}
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isSelected(row.id)}
                                        tabIndex={-1}
                                        selected={isSelected(row.id)}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="secondary"
                                                checked={isSelected(row.id)}
                                                inputProps={{
                                                    'aria-labelledby': row.name,
                                                }}
                                            />
                                        </TableCell>
                                        <StyledTableCell align="left">
                                            <Grid container sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                <Grid item>
                                                    <Avatar alt={row.name} src={`${process.env.PUBLIC_URL}/${row.picURL}`} />
                                                </Grid>
                                                <Grid item sx={{ marginLeft: '1em' }}>
                                                    <Grid container>
                                                        {row.name}
                                                    </Grid>
                                                    <Grid container sx={{ color: theme.palette.text.primary, opacity: '0.7' }}>
                                                        {row.email}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.role}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Button variant='contained'
                                                sx={{
                                                    fontFamily: 'Raleway',
                                                    height: '36px',
                                                    textTransform: 'none',
                                                    backgroundColor: theme.palette.secondary.main,
                                                    //border:`1px solid ${theme.palette.primary.main}`,
                                                    color: 'white'
                                                }}
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