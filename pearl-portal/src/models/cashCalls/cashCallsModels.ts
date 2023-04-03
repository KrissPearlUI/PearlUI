export interface CashCall {
    id?: string,
    fundId?: string,
    callDate?: string,
    dueDate?: string,
    lpId?: string,
    transType?: string,
    lpType?: string,
    amount?: number,
    cashCallNum?: number,
    callReceiver?: string,
    partOfCommitedCapital?: boolean,
    pcoId?: string
}

export interface NewCashCall {
    fundId?: string,
    lpId?: string,
    transType?: string,
    transTypeLP?: string,
    amount?: number,
    pcoId?: string
}


export const LPCashCallType = [
    "Additional Service Fee",
    "Differential Correction for Amounts outside of Commitment",
    "Differential Correction for Fees",
    "Differential Correction for Investments",
    "Follow-on investment",
    "Initial investment",
    "Interest payments",
    "Management Fee",
    "Operational Expenses",
    "Repayment",
    "Reserve",
    "Set-up Fee"
]