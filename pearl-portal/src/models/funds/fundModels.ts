import { LP, LPFundsOverview, PCO } from "../lps/lpModels";

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
}