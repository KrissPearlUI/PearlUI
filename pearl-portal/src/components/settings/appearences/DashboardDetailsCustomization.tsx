import { Box, Checkbox, FormControlLabel, Grid, RadioGroup } from '@mui/material';
import { routes } from './AppearenceComponent';

const DashboardDetailsCustomization = () => {

    return (
        <Box sx={{ width: '100%', marginLeft: '2em' }}>
            <Grid container spacing={1}>
                <RadioGroup name={`column-Dashboard`} defaultValue="">
                    {routes.filter(x => x.key === 'Dashboard')[0]?.data.map((option, optionIndex) => (
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