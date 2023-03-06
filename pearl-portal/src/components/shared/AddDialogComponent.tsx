import {Typography} from '@mui/material';
import {useTheme} from "@mui/material/styles";

interface AddProps {
    pageName:string; 
}


const AddDialogComponent = ({pageName}:AddProps) => {
    const theme=useTheme();

    return (
        <div>
            <div>
                <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>
                {`FundsOverview ... ${pageName}`}
                </Typography>
            
            </div>
        </div>
    );
};

export default AddDialogComponent;