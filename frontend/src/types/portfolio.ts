export interface Holding {
  symbol: string;
  companyName: string;
  quantity: number;
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  sector: string;
  marketCap: string;
}

export interface PortfolioData {
  holdings: Holding[];
  lastUpdated: string;
}