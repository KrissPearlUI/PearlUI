import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/rootSlice';
import SingleFundDocuments from '../../../components/funds/single/documents/SingleFundDocuments';
import AutocompletePCOComponent from '../../../components/pcos/single/AutocompletePCO';
import DatePickerPCOComponent from '../../../components/pcos/single/DatePickerPCO';
import SelectionPCOComponent from '../../../components/pcos/single/SelectionComponent';
import FiltersAndActionsPCOComponent from '../../../components/pcos/single/FiltersAndActionsPCO';
import SinglePCOBasic from '../../../components/pcos/single/basic/SinglePCOBasic';
import SinglePCOContactsComponent from '../../../components/pcos/single/contacts/SinglePCOContacts';
import SinglePCOTransactions from '../../../components/pcos/single/transactions/SinglePCOTransactions';
import SinglePCOValuationsComponent from '../../../components/pcos/single/valuations/SinglePCOValuations';
import SinglePCOExitsReservesComponent from '../../../components/pcos/single/exitsRealisations/SinglePCOExitsAndReserves';
import SinglePCOFinantialsComponent from '../../../components/pcos/single/finantials/SinglePCOFinantials';
import { fetchPCOs } from '../../../redux/thunks/pcoThunk';
import { setSelectedPCO } from '../../../redux/slices/pcos/pcosSlice';
import { AddDialogComponent } from '../../../components/shared/addPopup/AddPopupDialog';
import { setSelectedFund } from '../../../redux/slices/funds/fundsSlice';
import { EditDialogComponent } from '../../../components/shared/editPopup/EditPopupDialog';

const SinglePCO = () => {
    const dispatch = useAppDispatch();
    const { pcos, selectedPCO } = useSelector((state: RootState) => state.pcos);
    const [selectedView, setSelectedView] = useState<string>('basic');

    const handleButtonClick = (buttonId: string) => {
        setSelectedView(buttonId);
    };

    useEffect(() => {
        dispatch(fetchPCOs());
        dispatch(setSelectedFund(null));
    }, [dispatch])

    useEffect(() => {
        if (selectedPCO) {
            dispatch(setTopBarTitle(`${selectedPCO.shortName} Details`));
        } else {
            dispatch(setSelectedPCO(pcos[0]));
        }
    }, [dispatch, selectedPCO, pcos])

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'start', flexDirection: 'row', paddingLeft: '0.5em' }}>
            <Grid item xs={12} md={12} lg={12} sx={{ flex: 1 }}>
                <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'start' }}>
                    <Grid item xs={12} md={6} lg={6}>
                        <AutocompletePCOComponent selectedPCO={selectedPCO} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', flex: 1, justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'flex-end' }, alignSelf: 'flex-end' }}>
                        <DatePickerPCOComponent />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ flex: 1 }}>
                <Grid container spacing={2} sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'start' }}>
                    <Grid item xs={12} md={8} lg={8}>
                        <SelectionPCOComponent selectedItem={selectedView} handleButtonClick={handleButtonClick} />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex', flex: 1, justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'flex-end' }, alignSelf: 'flex-end' }}>
                        <FiltersAndActionsPCOComponent selectedItem={selectedView} handleButtonClick={handleButtonClick} addEditTooltip={selectedView === 'basic'
                            ? 'pcoBasic'
                            : 'transactions'} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ flex: 1, height: '82%' }}>
                {selectedView === 'basic' ? <SinglePCOBasic />
                    : selectedView === 'contacts'
                        ? <SinglePCOContactsComponent />
                        : selectedView === 'transactions'
                            ? <SinglePCOTransactions />
                            : selectedView === 'valuations'
                                ? <SinglePCOValuationsComponent />
                                : selectedView === 'exitsReserves'
                                    ? <SinglePCOExitsReservesComponent />
                                    : selectedView === 'pcoFinantials'
                                        ? <SinglePCOFinantialsComponent />
                                        : <SingleFundDocuments />}
            </Grid>
            <AddDialogComponent pageName={selectedView === 'transactions' ? 'transactions' : ''}
                pageTitle={selectedView === 'transactions' ? 'Add New Transaction' : ''} />
            <EditDialogComponent pageName={selectedView === 'basic' ? 'pcoBasic' : 'transactions'}
                pageTitle={selectedView === 'basic' ? 'Edit Basic Details' : 'Edit Transaction'} />
        </Grid>
    );
};

export default SinglePCO;