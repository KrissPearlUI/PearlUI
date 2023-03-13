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


const DashboardDetailsCustomization = () => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    
    
    return (
            <Box sx={{width: '100%', marginLeft:'2em'}}>
                <Grid container spacing={1}>
                    <RadioGroup name={`column-Dashboard`} defaultValue="">
                        {routes.filter(x=>x.key==='Dashboard')[0]?.data.map((option, optionIndex) => (
                            <FormControlLabel
                            control={
                              <Checkbox checked={option.isSelected} name={option.key} />
                            }
                            label={option.key}
                          />
                        ))}
                    </RadioGroup>
                </Grid>
            </Box>
                   
    );
};

export default DashboardDetailsCustomization;