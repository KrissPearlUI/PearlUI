import { Box, Checkbox, FormControlLabel, Grid, RadioGroup } from '@mui/material';
import { routes } from './AppearenceComponent';


const PCOsOverviewDetailsCustomization = () => {

    return (
        <Box sx={{ width: '100%', marginLeft: '2em' }}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={3} lg={3}>
                    <RadioGroup name={`column-PCOs`} defaultValue="">
                        {routes.filter(x => x.key === 'PCOs')[0]?.data.slice(0, 3).map((option, optionIndex) => (
                            <FormControlLabel
                                control={
                                    <Checkbox checked={option.isSelected} name={option.key} />
                                }
                                label={option.key}
                            />
                        ))}
                    </RadioGroup>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <RadioGroup name={`column-PCOs`} defaultValue="">
                        {routes.filter(x => x.key === 'PCOs')[0]?.data.slice(3, 6).map((option, optionIndex) => (
                            <FormControlLabel
                                control={
                                    <Checkbox checked={option.isSelected} name={option.key} />
                                }
                                label={option.key}
                            />
                        ))}
                    </RadioGroup>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <RadioGroup name={`column-PCOs`} defaultValue="">
                        {routes.filter(x => x.key === 'PCOs')[0]?.data.slice(6, 8).map((option, optionIndex) => (
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

export default PCOsOverviewDetailsCustomization;