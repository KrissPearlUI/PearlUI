import { Fund, LPFundsOverview } from "../lps/lpModels";

export interface Industry{
    id?:string,
    name?:string,
    numberOfIndustry?:number
}

export interface PCOSummary {
    id: string,
    pcoName: string,
    shortName: string,
    city: string,
    state: string,
    country: string,
    localCurrency: string,
    totalInvestments: number,
    numOfFunds: number,
    numOfLPS: number,
    status: string,
    funds?:Fund[]
    lps?:LPFundsOverview[],
    dateInitalInvestment?:string,
    dateExit?:string,
    currentStage?:string,
    initialStage?:string,
    emeraldIndustry1?:string,
    emeraldIndustry2?:string,
}

export interface PCOFinancial {
    pcoId?:string,
    sumNavFundCcy?:number,
    grossIRR?:number,
    currentValuation?:number
}
