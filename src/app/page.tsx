'use client';

import { useEffect, useState } from 'react';
import PortfolioTable from '@/components/PortfolioTable';
import DashboardMetrics from '@/components/DashboardMetrics';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLastUpdated(new Date(json.lastUpdated).toLocaleTimeString());
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-[1600px] mx-auto">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-brand-500 w-8 h-8" />
            Dynamic Portfolio
          </h1>
          <p className="text-zinc-400 mt-1">Real-time market insights and asset performance.</p>
        </div>
        
        <div className="glass-card px-4 py-2 rounded-full flex items-center gap-3 text-sm text-zinc-300">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          {loading && !data.length ? 'Connecting to market data...' : `Live updates on • Last synced: ${lastUpdated || '...'}`}
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {!loading || data.length > 0 ? (
        <div className="space-y-8 animate-in fade-in duration-700">
          <DashboardMetrics data={data} />
          
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-semibold text-white">Holdings & Performance</h2>
              <button 
                onClick={fetchData}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                title="Force Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="p-0 overflow-x-auto">
              <PortfolioTable data={data} />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-zinc-400">Loading portfolio data...</p>
          </div>
        </div>
      )}
    </main>
  );
}
