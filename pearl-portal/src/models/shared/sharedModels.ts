export interface PopoverTableProps {
    title: string;
    value: any;
}

export interface PopoverPanelProps {
    anchorEl: HTMLElement | null;
    popoverKey: string;
    handlePopoverClose: any;
    renderAmt: (amt: number, detail: boolean) => JSX.Element;
    showDetailQty: boolean;
    currencies: any[];
    balanceTableProps: any;
}