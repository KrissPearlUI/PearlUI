export interface LP {
    id: string,
    name: string,
    shortName: string,
    country?: string,
    address?: string,
    website?: string,
    mainContact?: string,
    relationshipPartner?: string,
    relationshipSS?: string,
    type?: string,
    firstInvestment?: string,
    totalCommitments: number,
    funds?: Fund[],
    pcos?: PCO[],
    commitments?: CommitmentBasic[],
    exits?: Exits[],
    totalInvestments?: number,
    totalDistributions?: number,
    reservesFees?: number,
    tappedOot?: boolean,
    numTerminated?: number,
    terminated?: TerminationFundLP[],
    fees: Fee[],
    dryPowder?: number,
    reserved?: number,
    capPaidIn?: number,
    avgDealsAvailable?: number,
    capAvailable?: number,
    dateTappedOut?: string,
    kpis?: KPI,
    city?: string,
    postalCode?: string
}

export interface TerminationFundLP {
    id?: string,
    lpId?: string,
    fundId?: string,
    dateTermination?: string
}

export interface LPFundsOverview {
    id: string,
    shortName: string,
    name: string,
    committedAmount?: number,
    fundCurrency: string,
    participationPercentage?: number,
}

export interface Fund {
    id: string,
    fundName: string,
    committedAmount?: number,
    amountInvested?: number,
    fundCurrency: string
}

export interface PCO {
    id: string,
    participationPercentage?: number,
    shortName: string,
    amountInvested?: number,
    localCurrency?: string,
    fundCurrency?: string,
}

export interface PCOExtended extends PCO {
    pcoName: string,
    country: string,
    dateFirstInvestment?: string,
    dateExit?: string,
    currentStage?: string,
    initialStage?: string,
    emeraldIndustry1?: string,
    emeraldIndustry2?: string,
    navEUR?: number,
}

export interface Commitment {
    invested: number,
    reservedForFees: number,
    followOns: number,
    unlocated: number,
}

export interface Fee {
    feeType: string,
    amount: number,
}

export interface KPI {
    netDPI?: number,
    grossDPI?: number,
    netTVPI?: number,
    grossTVPI?: number,
    netIRR?: number,
    grossIRR?: number,
}

export interface CommitmentBasic {
    id: string,
    date?: string,
    fundId?: string,
    fundName?: string,
    shortName?: string,
    committedAmount?: number,
    fundCurrency?: string,
    transfered?: boolean, 
    lpId?:string,
    lpShortName?:string,
    lpName?:string
}

export interface Exits {
    id: string,
    date?: string,
    pcoId?: string,
    pcoName?: string,
    shortName?: string,
    amountGained?: number,
    fundCurrency?: string,
    type?: string
}


export interface EditExit {
    id?: string,
    date?: string,
    pcoId?: string,
    pcoName?: string,
    shortName?: string,
    amountGained?: number,
    fundCurrency?: string,
    type?: string,
    fundId?:string,
}

export interface Distribution {
    recyclingReserveDistributions: number,
    nonRecallableDistributions: number,
    carriedInterestClawbackAccount: number,
    carriedInterestGP: number,
}

export interface Reserves {
    managementFee: number,
    operationalExpenses: number,
}

export interface LPPCOInvestmentsRequest {
    id: string;
    currency: string;
}


export interface NewLP {
    name?: string,
    shortName?: string,
    address?: string,
    city?: string,
    postalCode?: string | number,
    country?: string,
    type?: string,
    baseCapital?: number,
    website?: string
}