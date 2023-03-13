import { Fund, LPFundsOverview } from "../lps/lpModels";

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
    lps?:LPFundsOverview[]
}