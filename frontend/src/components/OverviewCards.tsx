import React from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';

interface OverviewCardsProps {
  data: any;
  holdings: any[];
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ data, holdings }) => {
  if(!data) {
    return null;
  }

  const cards = [
    {
      title: 'Total Portfolio Value',
      value: `₹${data.totalValue.toLocaleString('en-IN') ?? '-'}`,
      icon: BarChart3,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Gain/Loss',
      value: `₹${Math.abs(data.totalGainLoss).toLocaleString('en-IN') ?? '-'}`,
      icon: data.totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      iconColor: data.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.totalGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50',
      textColor: data.totalGainLoss >= 0 ? 'text-green-700' : 'text-red-700',
      prefix: data.totalGainLoss >= 0 ? '+' : '-',
    },
    {
      title: 'Portfolio Performance',
      value: (() => {
        // Always calculate from holdings array
        if (Array.isArray(holdings) && holdings.length > 0) {
          const totalValue = holdings.reduce((sum: number, h: any) => sum + (h.currentValue || h.Value || 0), 0);
          const invested = holdings.reduce((sum: number, h: any) => sum + ((h.avgPrice || h.AvgPrice || 0) * (h.quantity || h.Quantity || 0)), 0);
          if (invested > 0) {
            const perf = ((totalValue - invested) / invested) * 100;
            return `${perf.toFixed(2)}%`;
          }
        }
        return '0.00%';
      })(),
      icon: Number(data.performancePercentage) >= 0 ? TrendingUp : TrendingDown,
      iconColor: Number(data.performancePercentage) >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: Number(data.performancePercentage) >= 0 ? 'bg-green-50' : 'bg-red-50',
      textColor: Number(data.performancePercentage) >= 0 ? 'text-green-700' : 'text-red-700',
      prefix: Number(data.performancePercentage) >= 0 ? '+' : '-',
    },
    {
      title: 'Number of Holdings',
      value: (() => {
        if (Array.isArray(holdings)) return holdings.length.toString();
        return '0';
      })(),
      icon: Target,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor || 'text-gray-900'}`}>
                {card.prefix || ''}{card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;