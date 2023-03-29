import { Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

interface ExportProps {
    pageName: string
}

const ExportDialogComponent = ({ pageName }: ExportProps) => {
    const theme = useTheme();

    return (
        <div>
            <div>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    {`FundsOverview ... ${pageName}`}
                </Typography>

            </div>
        </div>
    );
};

export default ExportDialogComponent;