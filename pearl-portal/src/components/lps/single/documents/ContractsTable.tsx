import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { fetchCashCalls } from '../../../../redux/thunks/cashCallsThunk';
import { ContractDocument } from '../../../../models/documents/documentsModels';

const ContractsTable = () => {
    const dispatch = useAppDispatch();
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const theme = useTheme();
    const [rowData, setRowData] = useState<ContractDocument[]>([]);

    useEffect(() => {
        dispatch(fetchCashCalls());
    }, [dispatch])

    useEffect(() => {
        setRowData([]);
    }, [selectedLP])

    return (
        <Paper sx={{ flex: 1, display: 'flex', height: '100%' }}>
            <TableContainer component={Paper} sx={{ minWidth: 700, height: '100%', flex: 1, minHeight: '32em' }}>
                <Table stickyHeader aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
                                fontFamily: 'Raleway',
                                color: theme.palette.text.primary,
                                width: '30%'
                            }} align="left">Contracts</TableCell>
                            <TableCell sx={{
                                backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
                                fontFamily: 'Raleway',
                                color: theme.palette.text.primary,
                                width: '50%'
                            }} align="left">Document Name</TableCell>
                            <TableCell sx={{
                                backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
                                fontFamily: 'Raleway',
                                color: theme.palette.text.primary,
                                width: '20%'
                            }} align="left">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowData.map((row) => (
                            <TableRow key={`${row.shortDocumentName}-${row.documentName}`}>
                                <TableCell align="left">
                                    {row.shortDocumentName}
                                </TableCell>
                                <TableCell align="left">{row.documentName}</TableCell>
                                <TableCell align="left">{row.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    );
};


export default ContractsTable;
