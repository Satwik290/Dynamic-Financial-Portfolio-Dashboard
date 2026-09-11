# 📈 Dynamic Financial Portfolio Dashboard

A modern, high-performance financial portfolio dashboard built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, and **TanStack Table**. It tracks live NSE/BSE stock prices and delivers over 30+ financial metrics and fundamental analysis indicators with real-time updates and sector grouping.

![Dashboard Preview](https://raw.githubusercontent.com/Satwik290/Dynamic-Financial-Portfolio-Dashboard/main/public/preview.png) *(Optional preview image)*

---

## ✨ Features

- **⚡ Real-Time Market Price (CMP)**: Automatically polls live prices from financial data providers with 15-second intervals and fallback caching.
- **📊 Comprehensive 30+ Financial Metrics**:
  - **Valuation & Holdings**: Particulars, Ticker, Avg. Cost, Qty, Total Investment, Portfolio Weight (%), CMP, Present Value, Unrealized Gain/Loss (₹ and %).
  - **Valuation Ratios**: P/E (TTM), Price-to-Sales (P/S), Price-to-Book (P/B), Book Value, Market Cap.
  - **Profitability & Margins**: Revenue (TTM), EBITDA (TTM), EBITDA Margin (%), PAT, PAT Margin (%).
  - **Cash Flow & Solvency**: Operating Cash Flow (CFO Mar 24), 5-Year CFO, 5-Year Free Cash Flow (FCF), Debt to Equity, CFO-to-EBITDA, CFO-to-PAT.
  - **Growth Rates & Momentum**: Revenue Growth, EBITDA Growth, Profit Growth, Market Cap Growth, Stage-2 momentum classification.
- **📁 Sector Grouping & Aggregated Summaries**:
  - Assets organized hierarchically by industry sectors (Financial, Tech, Consumer, Power, Pipe, etc.).
  - Collapsible/expandable sector accordions with live aggregated Sector Investment, Sector Present Value, and Sector Gain/Loss.
- **📌 Responsive Sticky Table**: Smooth horizontal scrolling with a fixed/sticky "Particulars" column for seamless navigation across wide financial datasets.
- **🛡️ Robust Fallback & Resilience**: Seamlessly falls back to benchmark and seed metrics if external market APIs encounter rate limits or connection timeouts.
- **💎 Sleek Dark Mode Aesthetics**: Glassmorphism cards, pulsating live status indicators, vibrant financial green/red metrics, and smooth transitions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI & Components**: [React 19](https://react.dev/), [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Grid / Table**: [TanStack Table v8](https://tanstack.com/table)
- **Market Data & Scraper**: [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2), [Cheerio](https://cheerio.js.org/)
- **Deployment**: Netlify & Vercel ready

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or later recommended)
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Satwik290/Dynamic-Financial-Portfolio-Dashboard.git
   cd Dynamic-Financial-Portfolio-Dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the live dashboard.

---

## 📁 Project Structure

```text
├── netlify.toml                # Netlify deployment configuration
├── package.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── portfolio/
│   │   │       └── route.ts    # Real-time portfolio price & fundamentals endpoint
│   │   ├── layout.tsx          # Root layout & global styles
│   │   └── page.tsx            # Main dashboard overview page
│   ├── components/
│   │   ├── DashboardMetrics.tsx # Top-level KPI overview cards
│   │   └── PortfolioTable.tsx  # Dynamic grouped table with 30+ metrics
│   └── data/
│       ├── portfolioData.ts    # Model definitions & dataset processor
│       └── rawPortfolio.json   # Seed portfolio holding and fundamentals data
└── tsconfig.json
```

---

## 🌐 Deploying to Netlify (Free Hosting)

This project includes a pre-configured `netlify.toml` file with Next.js App Router support:

### Option A: Deploy with Git (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit with complete portfolio dashboard"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```
2. Go to [Netlify](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** and choose your repository.
4. Netlify will auto-detect the build settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click **"Deploy site"**!

### Option B: Deploy with Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Authenticate & deploy
netlify login
netlify init
netlify deploy --prod
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
