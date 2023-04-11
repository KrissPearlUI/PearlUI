import { Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

const PCOChartComponent = () => {
    const theme = useTheme();

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '0.5em' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                Forecast Revenue & EBITDA Growth
            </Typography>
        </Grid>
    );
};

export default PCOChartComponent;