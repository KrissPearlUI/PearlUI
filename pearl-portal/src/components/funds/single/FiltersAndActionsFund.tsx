import { Fab, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { GridApi } from 'ag-grid-community';
import { isValueEmpty } from '../../../helpers/app';
import AddButton from '../../shared/AddButton';
import ExportButton from '../../shared/ExportButton';
import EditButton from '../../shared/EditButton';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
        fabIcon: {
            marginLeft: 10,
            alignSelf: 'center',
        },
        searchBox: {
            width: '370px',
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
    }),
);

interface SingleSelectionProps {
    selectedItem: string
    handleButtonClick: any,
    addEditTooltip: string,
    searchTextValue: string | null,
    onValueChange: (v: any) => void,
    onCancelClick: (v: any) => void,
}

const FiltersAndActionsFundComponent = ({
    selectedItem,
    handleButtonClick,
    addEditTooltip,
    searchTextValue,
    onValueChange,
    onCancelClick }: SingleSelectionProps) => {
    const classes = useStyles();

    return (
        <>
            {selectedItem === 'basic' ? <EditButton pageName={'Edit Basic Details'} />
                : <Grid container>
                    <Grid item>
                        <TextField
                            className={classes.searchBox}
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            aria-label="search"
                            sx={{ marginRight: '0.5em' }}
                            value={searchTextValue}
                            onChange={onValueChange}
                            inputProps={{
                                style: { height: '1.5em' },
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon
                                    color="disabled" /></InputAdornment>,
                                endAdornment: isValueEmpty(searchTextValue) ? null :
                                    <InputAdornment position="end">
                                        <IconButton onClick={onCancelClick}><CloseIcon fontSize='small' /></IconButton>
                                    </InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item sx={{ marginRight: '0.5em' }} >
                        <AddButton pageName={addEditTooltip === 'commitments'
                            ? 'Add New Commitment'
                            : addEditTooltip === 'fundPortfolio' ? 'Add New Portfolio'
                                : addEditTooltip === 'fundCallsDist' ? 'Add New Call'
                                    : 'Add New Transaction'} />
                    </Grid>
                    <Grid item >
                        <ExportButton pageName='singleFund' />
                    </Grid>
                </Grid>}
        </>
    );
};

export default FiltersAndActionsFundComponent;