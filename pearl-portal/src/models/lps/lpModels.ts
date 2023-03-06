export interface LP {
  LP_ID: string,
  LP_Name: string,
  LP_ShortName: string,
  Country?: string,
  LP_Type?: string,
  TotalCommitment: number,
  Funds?:Fund[],
  PCOs?:PCO[],
  CapitalInvested?:number,
  CapitalDistributed?:number,
  Reserved?:number,
  TappedOut?:boolean
}

export interface LPFundsOverview {
    LP_ID: string,
    LP_ShortName: string,
    TotalCommitment: number,
    Commitments?:Commitment
  }

export interface Fund {
    Fund_ID: string,
    Name: string,
    CommittedAmmount: number,
}

export interface PCO {
    PCO_ID: string,
    ParticipationPercentage: number,
    PCO_ShortName: string,
}

export interface Commitment {
    Invested: number,
    ReservedForFees: number,
    FollowOns: number,
    Unlocated: number,
}

export interface Distribution {
    RecyclingReserveDistributions: number,
    NonRecallableDistributions: number,
    CarriedInterestClawbackAccount: number,
    CarriedInterestGP: number,
}

export interface Reserves {
    ManagementFee: number,
    OperationalExpenses: number,
}
