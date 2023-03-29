export interface Transaction {
  id: string;
  date: string;
  fundId: string;
  transType: string;
  investmentType: string;
  pcoId: string;
  lpId?: string,
  securityType: string;
  amountLocalCurrency: number;
  amountFundCurrency: number;
  amountEUR?: number,
  forexNT: number;
  preMoneyValuation: number;
  postMoneyValuation: number;
  warrantSecurityType?: string;
  warrantStrike?: number;
  warrantExpiration?: string;
}
