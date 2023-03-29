import { Button, ButtonGroup } from '@mui/material';
import { useTheme } from "@mui/material/styles";

interface SingleSelectionProps {
    selectedItem: string
    handleButtonClick: any
}

const SelectionPCOComponent = ({ selectedItem, handleButtonClick }: SingleSelectionProps) => {
    const theme = useTheme();

    return (
        <ButtonGroup variant="outlined" aria-label="outlined primary button group" sx={{ height: 36, overflow: 'auto', width: { xs: '500px', md: '100%', lg: '100%' } }}>
            <Button sx={{
                fontSize: { xs: 8, md: 12, lg: 12 },
                backgroundColor: selectedItem === 'basic' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'basic' ? 'white' : theme.palette.primary.main
            }}
                onClick={() => handleButtonClick('basic')}>
                Basic Information</Button>
            <Button sx={{
                fontSize: { xs: 8, md: 12, lg: 12 }, backgroundColor: selectedItem === 'contacts' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'contacts' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('contacts')}>
                Contacts</Button>
            <Button sx={{
                fontSize: { xs: 8, md: 12, lg: 12 }, backgroundColor: selectedItem === 'transactions' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'transactions' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('transactions')}>
                Transactions</Button>
            <Button sx={{
                fontSize: { xs: 8, md: 12, lg: 12 }, backgroundColor: selectedItem === 'valuations' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'valuations' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('valuations')}>
                Valuations</Button>
            <Button sx={{
                fontSize: { xs: 8, md: 12, lg: 12 }, backgroundColor: selectedItem === 'exitsReserves' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'exitsReserves' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('exitsReserves')}>
                Exit & Reserves</Button>
            <Button sx={{
                fontSize: { xs: 8, md: 12, lg: 12 }, backgroundColor: selectedItem === 'pcoFinantials' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'pcoFinantials' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('pcoFinantials')}>
                PCO Finantials</Button>
            <Button sx={{
                fontSize: { xs: 8, md: 12, lg: 12 }, backgroundColor: selectedItem === 'documents' ? theme.palette.primary.main : theme.palette.background.paper,
                color: selectedItem === 'documents' ? 'white' : theme.palette.primary.main
            }} onClick={() => handleButtonClick('documents')}>
                Documents</Button>
        </ButtonGroup>
    );
};

export default SelectionPCOComponent;