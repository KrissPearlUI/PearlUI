import { Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

const LPChartComponent = () => {
    const theme = useTheme();

    return (
        <div>
            <div>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    FundsOverview ...
                </Typography>

            </div>
        </div>
    );
};

export default LPChartComponent;