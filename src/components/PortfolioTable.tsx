import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val || 0);
};

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(val || 0);
};

const formatPercent = (val: number, divider = 100) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((val || 0) / divider); // Often percentages in JSON are decimals like 0.21, so divider=1
};

export default function PortfolioTable({ data }: { data: any[] }) {
  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('particulars', {
        header: 'Particulars',
        cell: (info) => (
          <div className="flex flex-col min-w-[150px]">
            <span className="font-semibold text-white">{info.getValue()}</span>
            <span className="text-xs text-zinc-500">{info.row.original.tickerYahoo?.replace('.NS', '').replace('.BO', '')}</span>
          </div>
        ),
      }),
      columnHelper.accessor('sector', {
        header: 'Sector',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Avg. Cost',
        cell: info => <span className="text-zinc-300">{formatCurrency(info.getValue())}</span>,
      }),
      columnHelper.accessor('qty', {
        header: 'Qty',
        cell: info => <span className="text-zinc-300">{info.getValue()}</span>,
      }),
      columnHelper.accessor('investment', {
        header: 'Investment',
        cell: info => <span className="text-white font-medium">{formatCurrency(info.getValue())}</span>,
      }),
      columnHelper.accessor('portfolioPercentage', {
        header: 'Weight',
        cell: info => <span className="text-zinc-400">{formatPercent(info.getValue(), 100)}</span>,
      }),
      columnHelper.accessor('cmp', {
        header: 'CMP (Live)',
        cell: info => <span className="text-white font-medium">{formatCurrency(info.getValue())}</span>,
      }),
      columnHelper.accessor('presentValue', {
        header: 'Present Value',
        cell: info => <span className="text-white font-medium">{formatCurrency(info.getValue())}</span>,
      }),
      columnHelper.accessor('gainLoss', {
        header: 'Gain/Loss',
        cell: (info) => {
          const val = info.getValue() as number;
          const isPositive = val >= 0;
          return (
            <div className={cn("flex items-center gap-1 font-semibold", isPositive ? "text-emerald-400" : "text-red-400")}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatCurrency(Math.abs(val))}
            </div>
          );
        },
      }),
      columnHelper.accessor('gainLossPercent', {
        header: 'Gain/Loss %',
        cell: info => {
          const val = info.getValue() as number;
          const isPositive = val >= 0;
          return (
            <span className={cn("font-medium", isPositive ? "text-emerald-400" : "text-red-400")}>
              {isPositive ? '+' : ''}{formatPercent(val, 1)}
            </span>
          );
        },
      }),
      columnHelper.accessor('peRatio', {
        header: 'P/E',
        cell: info => <span className="text-zinc-400">{info.getValue() || '-'}</span>,
      }),
      columnHelper.accessor('latestEarnings', {
        header: 'Earnings',
        cell: info => <span className="text-zinc-400 text-xs">{info.getValue() || '-'}</span>,
      }),
      // New Data Columns
      columnHelper.accessor('marketCap', {
        header: 'Market Cap',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('revenueTtm', {
        header: 'Revenue (TTM)',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('ebitdaTtm', {
        header: 'EBITDA (TTM)',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('ebitdaMargin', {
        header: 'EBITDA Margin',
        cell: info => <span className="text-zinc-400">{formatPercent(info.getValue(), 1)}</span>,
      }),
      columnHelper.accessor('pat', {
        header: 'PAT',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('patMargin', {
        header: 'PAT Margin',
        cell: info => <span className="text-zinc-400">{formatPercent(info.getValue(), 1)}</span>,
      }),
      columnHelper.accessor('cfoMarch24', {
        header: 'CFO (Mar 24)',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('cfo5Years', {
        header: 'CFO (5Y)',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('freeCashFlow5Years', {
        header: 'FCF (5Y)',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('debtToEquity', {
        header: 'D/E',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('bookValue', {
        header: 'Book Value',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('revenueGrowth', {
        header: 'Rev Growth',
        cell: info => <span className="text-zinc-400">{formatPercent(info.getValue(), 1)}</span>,
      }),
      columnHelper.accessor('ebitdaGrowth', {
        header: 'EBITDA Growth',
        cell: info => <span className="text-zinc-400">{formatPercent(info.getValue(), 1)}</span>,
      }),
      columnHelper.accessor('profitGrowth', {
        header: 'Profit Growth',
        cell: info => <span className="text-zinc-400">{formatPercent(info.getValue(), 1)}</span>,
      }),
      columnHelper.accessor('marketCapGrowth', {
        header: 'Mkt Cap Growth',
        cell: info => <span className="text-zinc-400">{formatPercent(info.getValue(), 1)}</span>,
      }),
      columnHelper.accessor('priceToSales', {
        header: 'P/S',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('cfoToEbitda', {
        header: 'CFO/EBITDA',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('cfoToPat', {
        header: 'CFO/PAT',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('priceToBook', {
        header: 'P/B',
        cell: info => <span className="text-zinc-400">{formatNumber(info.getValue())}</span>,
      }),
      columnHelper.accessor('stage2', {
        header: 'Stage-2',
        cell: info => <span className="text-zinc-400">{info.getValue()}</span>,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      grouping: ['sector'],
      expanded: true,
    },
  });

  return (
    <div className="w-full overflow-x-auto pb-4">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-xs text-zinc-400 uppercase bg-white/[0.03] border-b border-white/5">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 font-medium whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-white/5">
          {table.getRowModel().rows.map((row) => {
            if (row.getIsGrouped()) {
              // Calculate sector summaries
              const leafRows = row.getLeafRows();
              const totalInv = leafRows.reduce((sum, r) => sum + (r.original.investment || 0), 0);
              const totalPV = leafRows.reduce((sum, r) => sum + (r.original.presentValue || 0), 0);
              const totalGL = totalPV - totalInv;
              const isPositive = totalGL >= 0;

              return (
                <tr key={row.id} className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer" onClick={row.getToggleExpandedHandler()}>
                  <td colSpan={columns.length} className="px-6 py-4">
                    <div className="flex items-center justify-between w-full min-w-max">
                      <div className="flex items-center gap-2 text-brand-500 font-semibold text-base sticky left-0 bg-[#0a0a0a] group-hover:bg-[#111111] pr-4 py-1 z-10 transition-colors">
                        {row.getIsExpanded() ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        {row.getValue('sector')}
                        <span className="text-zinc-500 text-xs ml-2 font-normal">({leafRows.length} assets)</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm pl-4">
                        <div className="flex flex-col items-end">
                          <span className="text-zinc-500 text-xs">Investment</span>
                          <span className="text-white font-medium">{formatCurrency(totalInv)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-zinc-500 text-xs">Present Value</span>
                          <span className="text-white font-medium">{formatCurrency(totalPV)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-zinc-500 text-xs">Gain/Loss</span>
                          <span className={cn("font-bold flex items-center gap-1", isPositive ? "text-emerald-500" : "text-red-500")}>
                            {isPositive ? '+' : ''}{formatCurrency(totalGL)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }
            return (
              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]">
                {row.getVisibleCells().map((cell, i) => {
                  if (cell.column.id === 'sector') return null; // hide sector column since it's grouped
                  // Make particulars column sticky
                  const isParticulars = cell.column.id === 'particulars';
                  return (
                    <td key={cell.id} className={cn("px-6 py-4 whitespace-nowrap", isParticulars && "sticky left-0 bg-[#0a0a0a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]")}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
