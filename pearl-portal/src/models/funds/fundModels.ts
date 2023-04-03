import { Exits, KPI, LP, LPFundsOverview, PCO, TerminationFundLP } from "../lps/lpModels";

export interface FundSummary {
    id: string,
    shortName: string,
    fundName: string,
    currency: string,
    totalCommitmentsFundCcy: number,
    totalCommitmentsEUR?: number,
    numOfLPs: number,
    numOFPCOs: number,
    domicile?: string,
    vintage: string,
    lps?: LPFundsOverview[],
    pcos?: PCO[]
    country?: string
    address?: string,
    investmentComitee?: string,
    finalClosingDate?: string,
    type?: string,
    aifm?: string,
    aifmContact?: string,
    exits?: Exits[],
    numTerminated?: number,
    terminated?: TerminationFundLP[],
    terminatedBaseCapital?: number,
    terminatedCommitedCapital?: number,
    kpis?: KPI,
    sumBaseAmountEUR?: number,
    sumBaseAmountFundCccy?: number
    sumCommittedAmountFundCcy?: number,
    sumCommittedAmountEUR?: number,
    sumManagementFeeFundCcy?: number,
    sumManagementFeeEUR?: number
    sumSetUpFeeFundCcy?: number,
    sumSetUpFeeEUR?: number,
    sumOperationalExpensesFundCcy?: number,
    sumOperationalExpensesEUR?: number,
    sumAmountInvestedLocalCCy?: number,
    sumAmountInvestedFundCCy?: number,
    sumAmountInvestedEUR?: number,
    sumAmountRealizedLocalCCy?: number,
    sumAmountRealizedFundCCy?: number,
    sumAmountRealizedEUR?: number,
    sumNonRecycleFundCccy?: number,
    sumNonRecycleEUR?: number,
    sumRecycleFundCccy?: number,
    sumRecycleEUR?: number,
    sumReleasedDistributionsFundCccy?: number,
    sumReleasedDistributionsEUR?: number,
    sumEscrowFundCccy?: number,
    sumEscrowEUR?: number
}

export interface NewFund{
    fundName?:string,
    shortName?:string,
    country?: string
    address?: string,
    city?:string,
    postalCode?:string|number,
    currency: string,
    type?: string,
}
