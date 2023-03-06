import {CircularProgress, LinearProgress, Typography} from '@mui/material';
import {useTheme} from "@mui/material/styles";

const LoaderPage = () => {
    const theme=useTheme();
    return (
        <div>
            <div>
                <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>
                    Loading ...
                </Typography>
                <LinearProgress color="secondary"/>
                <CircularProgress variant="indeterminate"
                                  sx={{marginTop: '0.2em', color: 'orange', height: '1em', width: '1em'}}/>
            </div>
        </div>
    );
};

export default LoaderPage;