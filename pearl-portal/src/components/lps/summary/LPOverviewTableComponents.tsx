import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { capitalize, Grid, useTheme } from '@mui/material';
import { RootState } from '../../../redux/slices/rootSlice';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, INumberFilterParams, ISetFilterParams, ITooltipParams, ValueGetterParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
    DefaultColumnDef,
    DefaultSideBarDef,
    DefaultStatusPanelDef,
    filterParams,
    getGridTheme,
    quantityValueFormatter
} from '../../../helpers/agGrid';
import clsx from 'clsx';
import { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../redux/store';
import { Exits, Fund, LP, PCO } from '../../../models/lps/lpModels';
import AGGridLoader from '../../shared/AGGridLoader';
import LPToolbar from './LPToolbar';
import { setSelectedLP } from '../../../redux/slices/lps/lpsSlice';
import { fetchLPs } from '../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../models/funds/fundModels';
import { fetchFunds } from '../../../redux/thunks/fundThunk';
import { PCOSummary } from '../../../models/pcos/pcoModels';
import { fetchPCOs } from '../../../redux/thunks/pcoThunk';
import { useNavigate } from 'react-router-dom';
import { amountValueFormatter } from '../../../helpers/app';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '0.2em',
            overflow: 'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%'
        },
        searchBox: {
            width: '40%',
            marginRight: '1em'
        },
        buttons: {
            marginLeft: 5
        }
    })
);

const CustomStatusBar = (props: any) => {
    const theme = useTheme();

    const sumCommittedAmount = () => {
        const api = props.api;
        let sumCommitted = 0;
        let sumInvested = 0;
        let sumDistributed = 0;
        api.forEachNode((node: any) => {
            if (node.group) {
                return;
            }
            sumCommitted += Number(node.data.totalCommitments ?? 0);
            sumInvested += Number(node.data.totalInvestments ?? 0);
            sumDistributed += Number(node.data.totalDistributions ?? 0);
        });
        return <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', flex: 1 }}>
            <span style={{ marginRight: '1em' }}>Committed Amount: <strong>{amountValueFormatter(sumCommitted ?? 0, '')}</strong></span>
            <span style={{ marginRight: '1em' }}>Invested Amount: <strong>{amountValueFormatter(sumInvested ?? 0, '')}</strong></span>
            <span>Distributed Amount: <strong>{amountValueFormatter(sumDistributed ?? 0, '')}</strong></span>
        </div>
    };

    return (
        <div className="ag-status-bar" role="status">
            <div className="ag-status-bar-part ag-status-name-value" style={{ fontFamily: 'Raleway', color: theme.palette.mode === 'dark' ? 'white' : 'black', lineHeight: 1.5, fontWeight: 500 }}>
                {sumCommittedAmount()}
            </div>
        </div>
    );
};


const LPOverviewTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { lps } = useSelector((state: RootState) => state.lps);
    const { funds } = useSelector((state: RootState) => state.funds);
    const { pcos } = useSelector((state: RootState) => state.pcos);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [searchText,] = useState<string | null>(null);
    const theme = useTheme();
    const [allFunds, setAllFunds] = useState<FundSummary[] | null>([]);
    const [allPCOs, setAllPCOs] = useState<PCOSummary[] | null>([]);
    const [rowData, setRowData] = useState<LP[]>([]);
    const [selectedFundValues, setSelectedFundValues] = useState<FundSummary[] | null>([]);
    const [selectedPCOValues, setSelectedPCOValues] = useState<PCOSummary[] | null>([]);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: false,
        enableCellTextSelection: true,
        groupDisplayType: 'multipleColumns',
        sideBar: DefaultSideBarDef,
        statusBar: {
            statusPanels: [
                {
                    statusPanel: 'agTotalRowCountComponent',
                    align: 'left',
                },
                {
                    statusPanelFramework: CustomStatusBar,
                },
            ],
        }
    };


    /*     valueGetter: (params: ValueGetterParams) => {
            if (params && params.data) {
                if (selectedFundValues && selectedFundValues.length > 0) {
                    const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                    return fundsSelected && fundsSelected.length > 0 ? fundsSelected.reduce((a: number, v: Fund) => a = a + (v.committedAmount ?? 0), 0) : params.data.totalCommitments ?? 0
                } else {
                    return params.data.totalCommitments ?? 0
                }
            } else {
                return 0;
            }
        }, */

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'ID',
                headerTooltip:'Limited Partner ID',
                field: 'id',
                suppressFiltersToolPanel: true,
                minWidth: 120,
                hide: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Short Name',
                headerTooltip:'Limited Partner Short Name',
                field: 'shortName',
                minWidth: 115,
                tooltipField: 'shortName',
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.shortName;
                },
                valueSetter: (params) => valueSetter(params, 'shortName'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Name',
                headerTooltip:'Limited Partner Name',
                field: 'name',
                suppressFiltersToolPanel: true,
                minWidth: 120,
                tooltipField: 'name',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Headquarters',
                headerTooltip:'Limited Partner Headquarters',
                field: 'country',
                enableRowGroup: true,
                minWidth: 110,
                maxWidth: 140,
                valueGetter: (params) => {
                    return params.data?.country ? capitalize(params.data?.country.toString()) : '';
                },
                valueSetter: (params) => valueSetter(params, 'country'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Committed Capital',
                headerTooltip:'Limited Partner Committed Capital',
                field: 'totalCommitments',
                enableRowGroup: true,
                enableValue: true,
                minWidth: 220,
                filter: 'agNumberColumnFilter',
                type: 'numericColumn',
                tooltipComponentParams: { valueType: 'number' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedFundValues && selectedFundValues.length > 0) {
                            const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                            return fundsSelected && fundsSelected.length > 0 ? fundsSelected.reduce((a: number, v: Fund) => a = a + (v.committedAmount ?? 0), 0) : params.data.totalCommitments ?? 0
                        } else {
                            return params.data.totalCommitments ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedFundValues && selectedFundValues.length > 0) {
                            const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                            return fundsSelected && fundsSelected.length > 0 ? fundsSelected.reduce((a: number, v: Fund) => a = a + (v.committedAmount ?? 0), 0) : params.data.totalCommitments ?? 0
                        } else {
                            return params.data.totalCommitments ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Funds',
                headerTooltip:'Number of funds LP committed to',
                field: 'funds',
                minWidth: 90,
                maxWidth: 100,
                tooltipComponentParams: { type: 'funds' },
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedFundValues && selectedFundValues.length > 0) {
                            const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                            return fundsSelected ?? params.data.funds;
                        }
                        else {
                            return params.data.funds;
                        }
                    }
                    else
                        return 0;
                },
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedFundValues && selectedFundValues.length > 0) {
                            const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                            return fundsSelected && fundsSelected.length > 0 ? fundsSelected.length : params.data.funds?.length ?? 0
                        }
                        else {
                            return params.data.funds?.length ?? 0
                        }
                    }
                    else
                        return 0;
                },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
            },
            {
                headerName: 'Active PCOs',
                headerTooltip:'Number of PCOs LP invested in',
                field: 'pcos',
                minWidth: 100,
                maxWidth: 140,
                tooltipComponentParams: { type: 'pcos' },
                enableRowGroup: true,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length <= 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            return pcosSelected ?? params.data.pcos
                        } else if (selectedPCOValues && selectedPCOValues.length <= 0 && selectedFundValues && selectedFundValues.length > 0) {
                            let data = params.data.pcos?.map((pco: PCO) => ({
                                ...pco,
                                localCurrency: pcos.find((item: PCOSummary) => item.id === pco.id)?.localCurrency ?? '',
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));

                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId)
                            );
                            return filteredPortfolioCompaniesA ?? params.data.pcos
                        }
                        else if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length > 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            const data = pcosSelected?.map((pco: PCO) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));
                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId));

                            let filteredByFundCompanies: any[] = [];
                            if (filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length <= 0) {
                                const dataAll = params.data.pcos?.map((pco: PCO) => ({
                                    ...pco,
                                    fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                                }
                                ));
                                filteredByFundCompanies = dataAll?.filter((company: any) =>
                                    selectedFundValues.map((b) => b.id).includes(company.fundId));

                                filteredByFundCompanies = pcosSelected ? [...pcosSelected, ...filteredByFundCompanies] : filteredByFundCompanies;
                            }
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA : filteredByFundCompanies && filteredByFundCompanies.length > 0 ? filteredByFundCompanies : params.data.pcos
                        }
                        else {
                            return params.data.pcos
                        }
                    } else {
                        return 0;
                    }
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues?.length <= 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            return pcosSelected && pcosSelected.length > 0 ? pcosSelected.length : params.data.pcos?.length ?? 0
                        } else if (selectedPCOValues && selectedPCOValues.length <= 0 && selectedFundValues && selectedFundValues.length > 0) {
                            let data = params.data.pcos?.map((pco: PCO) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));

                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId)
                            );
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.length : params.data.pcos?.length
                        } else if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length > 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            const data = pcosSelected?.map((pco: PCO) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));
                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId));

                            let filteredByFundCompanies: any[] = [];
                            if (filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length <= 0) {
                                const dataAll = params.data.pcos?.map((pco: PCO) => ({
                                    ...pco,
                                    fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                                }
                                ));
                                filteredByFundCompanies = dataAll?.filter((company: any) =>
                                    selectedFundValues.map((b) => b.id).includes(company.fundId));

                                filteredByFundCompanies = [pcosSelected, ...filteredByFundCompanies];
                            }
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.length : filteredByFundCompanies && filteredByFundCompanies.length > 0 ? filteredByFundCompanies.length : params.data.pcos?.length
                        }
                        else {
                            return params.data.pcos?.length ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
            },
            {
                headerName: 'Type',
                headerTooltip:'Limited Partner Type',
                field: 'type',
                minWidth: 100,
                maxWidth: 150,
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params.data.type) {
                        return capitalize(params?.data?.type);
                    }
                    else
                        return '';
                },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Capital Invested',
                headerTooltip:'Limited Partner Capital Invested',
                field: 'totalInvestments',
                minWidth: 185,
                type: 'numericColumn',
                filter: 'agNumberColumnFilter',
                enableValue: true,
                tooltipComponentParams: { valueType: 'number' },
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length <= 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            return pcosSelected && pcosSelected.length > 0 ? pcosSelected.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : params.data.totalInvestments ?? 0
                        } else if (selectedPCOValues && selectedPCOValues.length <= 0 && selectedFundValues && selectedFundValues.length > 0) {
                            let data = params.data.pcos?.map((pco: PCO) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));

                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId)
                            );
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : params.data.totalInvestments
                        } else if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length > 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            const data = pcosSelected?.map((pco: PCO) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));
                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId));

                            let filteredByFundCompanies: any[] = [];
                            if (filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length <= 0) {
                                const dataAll = params.data.pcos?.map((pco: PCO) => ({
                                    ...pco,
                                    fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                                }
                                ));
                                filteredByFundCompanies = dataAll?.filter((company: any) =>
                                    selectedFundValues.map((b) => b.id).includes(company.fundId));

                                filteredByFundCompanies = pcosSelected ? [...pcosSelected, ...filteredByFundCompanies] : filteredByFundCompanies;
                            }
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : filteredByFundCompanies && filteredByFundCompanies.length > 0 ? filteredByFundCompanies.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : params.data.pcos
                        }
                        else {
                            return params.data.totalInvestments ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length <= 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            return pcosSelected && pcosSelected.length > 0 ? pcosSelected.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : params.data.totalInvestments ?? 0
                        } else if (selectedPCOValues && selectedPCOValues.length <= 0 && selectedFundValues && selectedFundValues.length > 0) {
                            let data = params.data.pcos?.map((pco: PCO) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));

                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId)
                            );
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : params.data.totalInvestments
                        } else if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length > 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            const data = pcosSelected?.map((pco: PCO) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));
                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId));

                            let filteredByFundCompanies: any[] = [];
                            if (filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length <= 0) {
                                const dataAll = params.data.pcos?.map((pco: PCO) => ({
                                    ...pco,
                                    fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.id)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                                }
                                ));
                                filteredByFundCompanies = dataAll?.filter((company: any) =>
                                    selectedFundValues.map((b) => b.id).includes(company.fundId));

                                filteredByFundCompanies = pcosSelected ? [...pcosSelected, ...filteredByFundCompanies] : filteredByFundCompanies;
                            }
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : filteredByFundCompanies && filteredByFundCompanies.length > 0 ? filteredByFundCompanies.reduce((a: number, v: PCO) => a = a + (v.amountInvested ?? 0), 0) : params.data.pcos
                        }
                        else {
                            return params.data.totalInvestments ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Reserved',
                headerTooltip:'Limited Partner Reserves for Fees',
                field: 'reservesFees',
                enableRowGroup: true,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                type: 'numericColumn',
                tooltipField: 'reservesFees',
                tooltipComponentParams: { valueType: 'number' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Capital Distributed',
                headerTooltip:'Limited Partner Capital Distributed',
                field: 'totalDistributions',
                filter: 'agNumberColumnFilter',
                enableValue: true,
                tooltipComponentParams: { valueType: 'number' },
                type: 'numericColumn',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                suppressFiltersToolPanel: true,
                minWidth: 185,
                valueFormatter: quantityValueFormatter,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length <= 0) {
                            const pcosSelected: Exits[] | null = params.data.exits?.filter((item2: Exits) => selectedPCOValues.some(val => val.id === item2.pcoId));
                            return pcosSelected && pcosSelected.length > 0 ? pcosSelected.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : params.data.totalDistributions ?? 0
                        } else if (selectedPCOValues && selectedPCOValues.length <= 0 && selectedFundValues && selectedFundValues.length > 0) {
                            let data = params.data.exits?.map((pco: Exits) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.pcoId)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));

                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId)
                            );
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : params.data.totalDistributions
                        }
                        else if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length > 0) {
                            const pcosSelected: Exits[] | null = params.data.exits?.filter((item2: Exits) => selectedPCOValues.some(val => val.id === item2.pcoId));
                            const data = pcosSelected?.map((pco: Exits) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.pcoId)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));
                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId));

                            let filteredByFundCompanies: any[] = [];
                            if (filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length <= 0) {
                                const dataAll = params.data.exits?.map((pco: Exits) => ({
                                    ...pco,
                                    fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.pcoId)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                                }
                                ));
                                filteredByFundCompanies = dataAll?.filter((company: any) =>
                                    selectedFundValues.map((b) => b.id).includes(company.fundId));

                                filteredByFundCompanies = pcosSelected ? [...pcosSelected, ...filteredByFundCompanies] : filteredByFundCompanies;
                            }
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : filteredByFundCompanies && filteredByFundCompanies.length > 0 ? filteredByFundCompanies.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : params.data.totalDistributions ?? 0
                        }
                        else {
                            return params.data.totalDistributions ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length <= 0) {
                            const pcosSelected: Exits[] | null = params.data.exits?.filter((item2: Exits) => selectedPCOValues.some(val => val.id === item2.pcoId));
                            return pcosSelected && pcosSelected.length > 0 ? pcosSelected.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : params.data.totalDistributions ?? 0
                        } else if (selectedPCOValues && selectedPCOValues.length <= 0 && selectedFundValues && selectedFundValues.length > 0) {
                            let data = params.data.exits?.map((pco: Exits) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.pcoId)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));

                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId)
                            );
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : params.data.totalDistributions
                        }
                        else if (selectedPCOValues && selectedPCOValues.length > 0 && selectedFundValues && selectedFundValues.length > 0) {
                            const pcosSelected: Exits[] | null = params.data.exits?.filter((item2: Exits) => selectedPCOValues.some(val => val.id === item2.pcoId));
                            const data = pcosSelected?.map((pco: Exits) => ({
                                ...pco,
                                fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.pcoId)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                            }
                            ));
                            const filteredPortfolioCompaniesA = data?.filter((company: any) =>
                                selectedFundValues.map((b) => b.id).includes(company.fundId));

                            let filteredByFundCompanies: any[] = [];
                            if (filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length <= 0) {
                                const dataAll = params.data.exits?.map((pco: Exits) => ({
                                    ...pco,
                                    fundId: params.data?.funds?.filter((item: Fund) => pcos.filter(z => z.id === pco.pcoId)[0]?.funds?.slice().some((subItem) => subItem?.id === item.id))[0]?.id ?? '',
                                }
                                ));
                                filteredByFundCompanies = dataAll?.filter((company: any) =>
                                    selectedFundValues.map((b) => b.id).includes(company.fundId));

                                filteredByFundCompanies = pcosSelected ? [...pcosSelected, ...filteredByFundCompanies] : filteredByFundCompanies;
                            }
                            return filteredPortfolioCompaniesA && filteredPortfolioCompaniesA.length > 0 ? filteredPortfolioCompaniesA.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : filteredByFundCompanies && filteredByFundCompanies.length > 0 ? filteredByFundCompanies.reduce((a: number, v: Exits) => a = a + (v.amountGained ?? 0), 0) : params.data.totalDistributions ?? 0
                        }
                        else {
                            return params.data.totalDistributions ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            /*  {
                 headerName: 'Tapped Out',
                 field: 'tappedOot',
                 valueGetter: (params: ValueGetterParams) => {
                     return params?.data?.tappedOot ? 'Yes' : 'No'
                 },
                 suppressFiltersToolPanel: true,
                 minWidth: 110,
                 maxWidth: 130,
                 enableRowGroup: true,
                 cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                 filterParams: {
                     buttons: ['reset'],
                 } as INumberFilterParams,
             } */
        ];
    }, [theme, selectedFundValues, selectedPCOValues, pcos]);

    const onValueChange = useCallback((event: any) => {
        setSearchTextValue(event.target.value)
        if (gridApi) {
            gridApi.setQuickFilter(event.target.value);
        }
    }, [gridApi]);

    const onCancelClick = useCallback(() => {
        setSearchTextValue('');
        if (gridApi) {
            gridApi.setQuickFilter('');
        }
    }, [gridApi]);

    const onFundChange = (event: React.SyntheticEvent, values: FundSummary[] | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedFundValues(values);
        let result = lps;
        if (values && values.length > 0) {
            result = lps.filter(item1 =>
                item1?.funds?.some(item2 => values.some(val => val.id === item2.id))
            );
            /*  result = result
                 .map(item => ({
                     ...item,
                     funds: lps.filter(item1 =>
                         item1?.funds?.some(item2 => event.some(val => val.id === item2.id)))
                 }))
                 .filter(item => item?.funds?.length > 0); */
            if (selectedPCOValues && selectedPCOValues.length > 0 && !searchTextValue) {
                result = result.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedPCOValues) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedPCOValues && selectedPCOValues.length > 0 && searchTextValue) {
                result = result.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            if (selectedPCOValues && selectedPCOValues.length > 0 && !searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedPCOValues) {
                setRowData(lps);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedPCOValues && selectedPCOValues.length > 0 && searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(lps);
            }
        }
    };

    const onPCOChange = (event: React.SyntheticEvent, values: PCOSummary[] | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedPCOValues(values);
        let result = lps;
        if (values && values.length > 0) {
            result = lps.filter(item1 =>
                item1?.pcos?.some(item2 => values.some(val => val.id === item2.id))
            );

            if (selectedFundValues && selectedFundValues?.length > 0 && !searchTextValue) {
                result = result.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedFundValues) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedFundValues && selectedFundValues?.length > 0 && searchTextValue) {
                result = result.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            if (selectedFundValues && selectedFundValues?.length > 0 && !searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedFundValues) {
                setRowData(lps);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedFundValues && selectedFundValues?.length > 0 && searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(lps);
            }
        }
    };

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params?.api);
    };

    const valueSetter = (params: ValueSetterParams, field: string) => {
        const value = params.newValue;
        const data = params.data;
        if (data[field] !== value) {
            data[field] = value;
            return true;
        } else {
            return false;
        }
    };

    const loadingOverlayRendererParams = useMemo(() => {
        return {
            loadingMessage: 'Loading LPs Overview...',
        };
    }, []);

    function handleRowClick(event: any) {
        const rowData = event.data;
        if (rowData) {
            dispatch(setSelectedLP(rowData));
        }
        // Assuming you have a unique ID for each row, you can use it to construct the URL for the other page
        const otherPageUrl = `/lpsOverview/singleLP`;
        navigate(otherPageUrl);
    }

    useEffect(() => {
        dispatch(fetchLPs());
        dispatch(fetchFunds());
        dispatch(fetchPCOs());
    }, [dispatch])

    useEffect(() => {
        if (lps && lps.length > 0) {
            setRowData(lps.slice().sort(function (a, b) {
                if (a.id?.toLowerCase() < b.id?.toLowerCase()) return -1;
                if (a.id?.toLowerCase() > b.id?.toLowerCase()) return 1;
                return 0;
            }));
        }
    }, [lps])

    useEffect(() => {
        setAllFunds(funds);
    }, [funds])

    useEffect(() => {
        setAllPCOs(pcos);
    }, [pcos])

    return (
        <Grid container className={classes.root}>
            <LPToolbar searchText={searchText}
                funds={allFunds}
                pcos={allPCOs}
                selectedFundValue={selectedFundValues}
                selectedPCOValue={selectedPCOValues}
                searchTextValue={searchTextValue}
                onValueChange={onValueChange}
                onCancelClick={onCancelClick}
                onFundChange={onFundChange}
                onPCOChange={onPCOChange}
            />
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{ height: selectedFundValues?.length === 0 && selectedPCOValues?.length === 0 ? '93%' : ((selectedFundValues && selectedFundValues.length > 3) || (selectedPCOValues && selectedPCOValues.length > 2)) ? '84.5%' : '93%' }}>
                <AgGridReact gridOptions={gridOptions}
                    columnDefs={getColumnDefs}
                    rowData={rowData}
                    onGridReady={onGridReady}
                    loadingOverlayComponentParams={loadingOverlayRendererParams}
                    loadingOverlayComponent={AGGridLoader}
                    tooltipShowDelay={0}
                    tooltipHideDelay={10000}
                    onRowClicked={handleRowClick}
                />
            </div>
        </Grid>
    );
};


export default LPOverviewTable;