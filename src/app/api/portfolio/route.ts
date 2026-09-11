import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import * as cheerio from 'cheerio';
import { portfolioData } from '@/data/portfolioData';

// Simple in-memory cache to prevent rate-limiting when polling every 15s
let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 14000; // 14 seconds

async function fetchGoogleFinanceData(ticker: string) {
  if (!ticker) return { peRatio: 'N/A', latestEarnings: 'N/A' };
  try {
    const url = `https://www.google.com/finance/quote/${ticker}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    if (!response.ok) return { peRatio: 'N/A', latestEarnings: 'N/A' };
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    let peRatio = 'N/A';
    let latestEarnings = 'N/A';
    
    $('div').each((i, el) => {
      const text = $(el).text();
      if (text === 'P/E ratio') {
        const valueDiv = $(el).next();
        if (valueDiv.length) {
          peRatio = valueDiv.text().trim();
        }
      }
    });

    if (peRatio === 'N/A') {
        const peNode = $('div:contains("P/E ratio")').last().next();
        if (peNode.length) peRatio = peNode.text().trim() || 'N/A';
    }

    $('div').each((i, el) => {
      const text = $(el).text();
      if (text === 'Earnings' || text === 'Next earnings date') {
        const valueDiv = $(el).next();
        if (valueDiv.length) {
            latestEarnings = valueDiv.text().trim();
        }
      }
    });

    if (latestEarnings === 'N/A') {
        const earningsNode = $('div:contains("Next earnings date")').last().next();
        if (earningsNode.length) latestEarnings = earningsNode.text().trim() || 'N/A';
    }

    return { peRatio, latestEarnings };
  } catch (error) {
    console.error(`Error scraping Google Finance for ${ticker}:`, error);
    return { peRatio: 'N/A', latestEarnings: 'N/A' };
  }
}

export async function GET() {
  try {
    const now = Date.now();
    if (cachedData && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(cachedData);
    }

    // Fetch data for all portfolio items in parallel
    const enrichedData = await Promise.all(
      portfolioData.map(async (item) => {
        let cmp = item.cmpStatic || item.purchasePrice || 0;
        let googleData = { peRatio: item.peTtm?.toString() || 'N/A', latestEarnings: item.latestEarnings?.toString() || 'N/A' };
        
        try {
          if (item.tickerYahoo) {
            // 1. Fetch CMP from Yahoo Finance
            const quote = await yahooFinance.quote(item.tickerYahoo);
            if (quote) {
              cmp = (quote as any).regularMarketPrice || cmp;
            }
          }
          
          if (item.tickerGoogle) {
            // 2. Fetch P/E and Earnings from Google Finance
            const scrapedData = await fetchGoogleFinanceData(item.tickerGoogle);
            if (scrapedData.peRatio !== 'N/A') googleData.peRatio = scrapedData.peRatio;
            if (scrapedData.latestEarnings !== 'N/A') googleData.latestEarnings = scrapedData.latestEarnings;
          }

          // 3. Calculate derived metrics
          const investment = item.purchasePrice * item.qty;
          const presentValue = cmp * item.qty;
          const gainLoss = presentValue - investment;
          const gainLossPercent = investment > 0 ? (gainLoss / investment) : 0;

          return {
            ...item,
            cmp,
            investment,
            presentValue,
            gainLoss,
            gainLossPercent,
            peRatio: googleData.peRatio,
            latestEarnings: googleData.latestEarnings,
          };
        } catch (err) {
          console.error(`Failed to fetch data for ${item.particulars}`, err);
          // Fallback if APIs fail
          const investment = item.purchasePrice * item.qty;
          const presentValue = cmp * item.qty;
          const gainLoss = presentValue - investment;
          const gainLossPercent = investment > 0 ? (gainLoss / investment) : 0;

          return {
            ...item,
            cmp,
            investment,
            presentValue,
            gainLoss,
            gainLossPercent,
            peRatio: item.peTtm?.toString() || 'Error',
            latestEarnings: item.latestEarnings?.toString() || 'Error',
          };
        }
      })
    );

    // Calculate Portfolio (%)
    const totalPresentValue = enrichedData.reduce((sum, item) => sum + item.presentValue, 0);
    const finalData = enrichedData.map(item => ({
      ...item,
      portfolioPercentage: totalPresentValue > 0 ? (item.presentValue / totalPresentValue) * 100 : 0
    }));

    cachedData = { success: true, data: finalData, lastUpdated: new Date().toISOString() };
    lastFetchTime = now;

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}
