import { Exits, KPI, LP, LPFundsOverview, PCO, TerminationFundLP } from "../lps/lpModels";

export interface FundSummary {
    id: string,
    shortName: string,
    fundName: string,
    currency: string,
    totalCommitments: number,
    numOfLPs: number,
    numOFPCOs: number,
    domicile?:string,
    vintage:string,
    lps?:LPFundsOverview[],
    pcos?:PCO[]
    country?:string
    address?:string,
    investmentComitee?:string,
    finalClosingDate?:string,
    type?:string,
    aifm?:string,
    aifmContact?:string,
    exits?: Exits[],
    numTerminated?:number,
    terminated?:TerminationFundLP[],
    terminatedBaseCapital?:number,
    terminatedCommitedCapital?:number,
    kpis?:KPI
}

