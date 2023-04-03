export interface DistributionBasic {
    id?: string,
    fundId?: string,
    noticeDate?: string,
    distDate?: string,
    lpId?: string,
    transType?: string,
    lpType?: string,
    amount?: number,
    distNum?: number,
    distReciever?: string,
    pcoId?: string
}

export interface NewDistribution {
    fundId?: string,
    lpId?: string,
    transType?: string,
    lpType?: string,
    amount?: number,
    pcoId?: string
}

export const LPDistributionTypes=[
    "Carried Interest in Clawback account",
    "Carried Interest to GP",
    "Non-Recallable Distributions",
    "Recycling Reserve Distributions",
]