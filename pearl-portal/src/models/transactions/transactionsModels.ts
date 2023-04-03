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

export interface NewTransaction {
  fundId: string;
  transType: string;
  investmentType: string;
  pcoId: string;
  securityType: string;
  amountFundCurrency: number;
}

export const TransactionType = [
  "Conversion",
  "Exercise",
  "Investment",
  "Realization",
  "Spin-off",
  "Split"
]

export const InvestmentType = [
  "Follow-on",
  "Initial",
]

export const SecurityType = [
  "Bridge Note",
  "Common Shares",
  "Convertible Note",
  "Efficiency Capital",
  "Escrow release",
  "Preferred Seed",
  "Preferred Series A",
  "Preferred Series B",
  "Preferred Series C",
  "Preferred Series D",
  "Preferred Series E",
  "Preferred Series F",
  "Preferred Series G",
  "Preferred Series H",
  "Preferred Shares",
  "Public listed shares",
  "SAFE",
  "Short Term Loan",
  "Warrants",
]