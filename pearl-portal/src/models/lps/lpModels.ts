export interface LP {
    id: string,
    name: string,
    shortName: string,
    country?: string,
    type?: string,
    totalCommitments: number,
    funds?:Fund[],
    pcos?:PCO[],
    totalInvestments?:number,
    totalDistributions?:number,
    reservesFees?:number,
    tappedOot?:boolean
}

export interface LPFundsOverview {
    id: string,
    shortName: string,
    name: string,
    committedAmount?:number,
    fundCurrency:string,
    participationPercentage?: number,
  }

export interface Fund {
    id: string,
    fundName: string,
    committedAmount?: number,
    amountInvested?: number,
    fundCurrency:string
}

export interface PCO {
    id: string,
    participationPercentage?: number,
    shortName: string,
    amountInvested?: number,
    localCurrency?:string,
    fundCurrency?:string
}

export interface Commitment {
    invested: number,
    reservedForFees: number,
    followOns: number,
    unlocated: number,
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
