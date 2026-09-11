import rawData from './rawPortfolio.json';

export interface PortfolioItem {
  id: string;
  particulars: string;
  sector: string;
  purchasePrice: number;
  qty: number;
  tickerYahoo: string;
  tickerGoogle: string;
  cmpStatic: number;
  marketCap: number;
  peTtm: number;
  latestEarnings: number;
  revenueTtm: number;
  ebitdaTtm: number;
  ebitdaMargin: number;
  pat: number;
  patMargin: number;
  cfoMarch24: number;
  cfo5Years: number;
  freeCashFlow5Years: number;
  debtToEquity: number;
  bookValue: number;
  revenueGrowth: number;
  ebitdaGrowth: number;
  profitGrowth: number;
  marketCapGrowth: number;
  priceToSales: number;
  cfoToEbitda: number;
  cfoToPat: number;
  priceToBook: number;
  stage2: string;
}

const parsedData: PortfolioItem[] = [];
let currentSector = 'Others';

rawData.forEach((item: any, index: number) => {
  if (!item.Particulars && !item['NSE/BSE']) return; // Skip total rows

  const p = item.Particulars?.trim() || '';
  if (
    p === 'Financial Sector' ||
    p === 'Tech Sector' ||
    p === 'Consumer' ||
    p === 'Power' ||
    p === 'Pipe Sector' ||
    p === 'Others'
  ) {
    currentSector = p.replace(' Sector', '').trim();
    return;
  }
  
  if (item.No !== null && typeof item.No === 'number') {
    let tickerYahoo = '';
    let tickerGoogle = '';
    
    if (typeof item['NSE/BSE'] === 'number' || (typeof item['NSE/BSE'] === 'string' && /^\d+$/.test(item['NSE/BSE']))) {
      tickerYahoo = `${item['NSE/BSE']}.BO`;
      tickerGoogle = `BOM:${item['NSE/BSE']}`;
    } else if (typeof item['NSE/BSE'] === 'string') {
      tickerYahoo = `${item['NSE/BSE']}.NS`;
      tickerGoogle = `NSE:${item['NSE/BSE']}`;
    }

    parsedData.push({
      id: index.toString(),
      particulars: item.Particulars.trim(),
      sector: currentSector,
      purchasePrice: item['Purchase Price'] || 0,
      qty: item['Qty'] || 0,
      tickerYahoo,
      tickerGoogle,
      cmpStatic: item['CMP'] || 0,
      marketCap: item['Market Cap'] || 0,
      peTtm: item['P/E (TTM)'] || 0,
      latestEarnings: item['Latest Earnings'] || 0,
      revenueTtm: item['Revenue (TTM)'] || 0,
      ebitdaTtm: item['EBITDA\n(TTM)'] || 0,
      ebitdaMargin: item['EBITDA (%)'] || 0,
      pat: item['PAT'] || 0,
      patMargin: item['PAT (%)'] || 0,
      cfoMarch24: item['CFO (March 24)'] || 0,
      cfo5Years: item['CFO \n(5 years)'] || 0,
      freeCashFlow5Years: item['Free Cash Flow\n(5 years)'] || 0,
      debtToEquity: item['Debt to Equity'] || 0,
      bookValue: item['Book Value'] || 0,
      revenueGrowth: item['Revenue'] || 0,
      ebitdaGrowth: item['EBITDA'] || 0,
      profitGrowth: item['Profit'] || 0,
      marketCapGrowth: item['Market\nCap'] || 0,
      priceToSales: item['Price to Sales'] || 0,
      cfoToEbitda: item['CFO to EBITDA'] || 0,
      cfoToPat: item['CFO to PAT'] || 0,
      priceToBook: item['Price to book'] || 0,
      stage2: String(item['Stage-2'] || ''),
    });
  }
});

export const portfolioData = parsedData;
