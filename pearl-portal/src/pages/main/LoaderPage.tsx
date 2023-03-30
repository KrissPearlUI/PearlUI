import { CircularProgress, LinearProgress, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

const LoaderPage = () => {
    const theme = useTheme();
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', flex:1, height:'100%', width:'100%'}}>
            <div>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Loading ...
                </Typography>
                <CircularProgress variant="indeterminate"
                    sx={{ marginTop: '0.2em', color:theme.palette.text.primary, height: '1em', width: '1em' }} />
            </div>
        </div>
    );
};

export default LoaderPage;