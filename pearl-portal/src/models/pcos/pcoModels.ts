import { Fund, LPFundsOverview } from "../lps/lpModels";

export interface Industry {
    id?: string,
    name?: string,
    numberOfIndustry?: number
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
    amountInvestedLocalCcy?: number,
    amountInvestedFundCcy?: number
    numOfFunds: number,
    numOfLPS: number,
    status: string,
    funds?: Fund[]
    lps?: LPFundsOverview[],
    dateInitalInvestment?: string,
    dateExit?: string,
    currentStage?: string,
    initialStage?: string,
    emeraldIndustry1?: string,
    emeraldIndustry2?: string,
    address?: string,
    website?: string,
    currentDealteam?: string,
    boardSeat?: string,
    grossIRR?: number,
    currentRound?: string,
    lastRound?: string,
    currentValuationPCO?: number,
    currentValuationEmerald?: number,
    realised?: number
}

export interface PCOFinancial {
    pcoId?: string,
    sumNavFundCcy?: number,
    grossIRR?: number,
    currentValuation?: number
}

export interface PCOInvestments {
    date: string;
    fundId: string;
    investmentType: string;
    pcoId: string;
    securityType: string;
    amountInvestedLocalCcy: number;
    amountInvestedFundCcy: number;
}
