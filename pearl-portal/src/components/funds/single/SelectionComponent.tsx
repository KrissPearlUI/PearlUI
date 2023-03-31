import { Button, ButtonGroup } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/rootSlice';

interface SingleSelectionProps {
    selectedItem: string
    handleButtonClick: any
}

const SelectionFundComponent = ({ selectedItem, handleButtonClick }: SingleSelectionProps) => {
    const theme = useTheme();
    const {
        drawerOpen,
    } = useSelector((state: RootState) => state.app);

    return (
        <ButtonGroup variant="outlined" aria-label="outlined primary button group" sx={{ height: 36, overflow: 'auto', width: { xs: '500px', md: '100%', lg: '100%' } }}>
            <Button sx={{
                fontSize: { xs: 8, sm: 8, md: drawerOpen ? 11 : 12, lg: drawerOpen ? 11 : 12 },
                backgroundColor: selectedItem === 'basic' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'basic' ? 'white' : theme.palette.primary.main
            }}
                onClick={() => handleButtonClick('basic')}>
                Basic Information</Button>
            <Button sx={{
                fontSize: { xs: 8, sm: 8, md: drawerOpen ? 11 : 12, lg: drawerOpen ? 11 : 12 }, backgroundColor: selectedItem === 'commitments' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'commitments' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('commitments')}>
                Commitments</Button>
            <Button sx={{
                fontSize: { xs: 8, sm: 8, md: drawerOpen ? 11 : 12, lg: drawerOpen ? 11 : 12 }, backgroundColor: selectedItem === 'portfolio' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'portfolio' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('portfolio')}>
                Portfolio</Button>
            <Button sx={{
                fontSize: { xs: 8, sm: 8, md: drawerOpen ? 11 : 12, lg: drawerOpen ? 11 : 12 }, backgroundColor: selectedItem === 'callsDist' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'callsDist' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('callsDist')}>
                Calls & Distributions</Button>
            <Button sx={{
                fontSize: { xs: 8, sm: 8, md: drawerOpen ? 11 : 12, lg: drawerOpen ? 11 : 12 }, backgroundColor: selectedItem === 'transactions' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'transactions' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('transactions')}>
                Transactions</Button>
            <Button sx={{
                fontSize: { xs: 8, sm: 8, md: drawerOpen ? 11 : 12, lg: drawerOpen ? 11 : 12 }, backgroundColor: selectedItem === 'documents' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'documents' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('documents')}>
                Documents</Button>
        </ButtonGroup>
    );
};

export default SelectionFundComponent;