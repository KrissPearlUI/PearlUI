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
    partOfCommitedCapital?: boolean
}