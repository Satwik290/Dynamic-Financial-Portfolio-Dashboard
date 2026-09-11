import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign, PieChart, TrendingUp } from 'lucide-react';

interface Props {
  data: any[];
}

export default function DashboardMetrics({ data }: Props) {
  const metrics = useMemo(() => {
    let totalInvestment = 0;
    let totalPresentValue = 0;

    data.forEach((item) => {
      totalInvestment += item.investment || 0;
      totalPresentValue += item.presentValue || 0;
    });

    const totalGainLoss = totalPresentValue - totalInvestment;
    const gainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
    const isPositive = totalGainLoss >= 0;

    return {
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      gainLossPercentage,
      isPositive
    };
  }, [data]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard 
        title="Total Investment" 
        value={formatCurrency(metrics.totalInvestment)} 
        icon={<PieChart className="w-5 h-5 text-zinc-400" />}
      />
      
      <MetricCard 
        title="Present Value" 
        value={formatCurrency(metrics.totalPresentValue)} 
        icon={<DollarSign className="w-5 h-5 text-zinc-400" />}
      />
      
      <div className={`glass-card rounded-2xl p-6 relative overflow-hidden group border ${metrics.isPositive ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${metrics.isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-zinc-400 font-medium text-sm">Overall Returns</h3>
          {metrics.isPositive ? (
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          ) : (
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="flex items-baseline gap-3">
          <p className={`text-3xl font-bold tracking-tight ${metrics.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {metrics.isPositive ? '+' : ''}{formatCurrency(metrics.totalGainLoss)}
          </p>
          <span className={`text-sm font-semibold px-2 py-1 rounded-md ${metrics.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {metrics.isPositive ? <ArrowUpRight className="inline w-3 h-3 mr-1" /> : <ArrowDownRight className="inline w-3 h-3 mr-1" />}
            {Math.abs(metrics.gainLossPercentage).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:bg-white/[0.03] transition-colors border border-white/5">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
    </div>
  );
}
