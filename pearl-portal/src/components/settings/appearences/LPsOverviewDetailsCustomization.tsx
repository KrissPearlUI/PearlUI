import {Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, Divider, FormControlLabel, Grid,IconButton,Paper,Radio,RadioGroup,Tooltip,Typography} from '@mui/material';
import {darken, useTheme} from "@mui/material/styles";
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../landing/LPChart';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { routes } from './AppearenceComponent';

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


const LPsOverviewDetailsCustomization = () => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    
    
    return (
            <Box sx={{width: '100%', marginLeft:'2em'}}>
                <Grid container spacing={1}>
                <Grid item xs={3}>
                    <RadioGroup name={`column-Dashboard`} defaultValue="">
                        {routes.filter(x=>x.key==='LPs')[0]?.data.slice(0,3).map((option, optionIndex) => (
                            <FormControlLabel
                            control={
                              <Checkbox checked={option.isSelected} name={option.key} />
                            }
                            label={option.key}
                          />
                        ))}
                    </RadioGroup>
                </Grid>
                <Grid item xs={3}>
                    <RadioGroup name={`column-Dashboard`} defaultValue="">
                        {routes.filter(x=>x.key==='LPs')[0]?.data.slice(3,6).map((option, optionIndex) => (
                            <FormControlLabel
                            control={
                              <Checkbox checked={option.isSelected} name={option.key} />
                            }
                            label={option.key}
                          />
                        ))}
                    </RadioGroup>
                </Grid>
                <Grid item xs={3}>
                    <RadioGroup name={`column-Dashboard`} defaultValue="">
                        {routes.filter(x=>x.key==='LPs')[0]?.data.slice(6,9).map((option, optionIndex) => (
                            <FormControlLabel
                            control={
                              <Checkbox checked={option.isSelected} name={option.key} />
                            }
                            label={option.key}
                          />
                        ))}
                    </RadioGroup>
                </Grid>
                <Grid item xs={3}>
                    <RadioGroup name={`column-Dashboard`} defaultValue="">
                        {routes.filter(x=>x.key==='LPs')[0]?.data.slice(9,11).map((option, optionIndex) => (
                            <FormControlLabel
                            control={
                              <Checkbox checked={option.isSelected} name={option.key} />
                            }
                            label={option.key}
                          />
                        ))}
                    </RadioGroup>
                </Grid>
                </Grid>
            </Box>
                   
    );
};

export default LPsOverviewDetailsCustomization;