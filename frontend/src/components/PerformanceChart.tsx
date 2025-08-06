import React, { useState } from 'react';
import { LineChart } from 'lucide-react';

interface PerformanceChartProps {
  data: any;
}

const periodOptions = [
  { key: '1month', label: '1 Month' },
  { key: '3months', label: '3 Months' },
  { key: '1year', label: '1 Year' },
];

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1year');

  if (!data) return null;

  const timeline = data.timeline || [];
  // Filter timeline based on selectedPeriod
  let filteredTimeline = timeline;
  if (selectedPeriod === '1month') {
    filteredTimeline = timeline.slice(-2); // last 2 months
  } else if (selectedPeriod === '3months') {
    filteredTimeline = timeline.slice(-4); // last 4 months
  } // 1year = all

  const returns = data.returns || {};

  // Chart lines config
  const lines = [
    { key: 'portfolio', color: '#3B82F6', label: 'Portfolio' },
    { key: 'nifty50', color: '#10B981', label: 'Nifty 50' },
    { key: 'gold', color: '#F59E0B', label: 'Gold' },
  ];

  // SVG chart dimensions
  const width = 400;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 20 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Find min and max values for scaling
  const allValues = timeline.flatMap((d: any) => [d.portfolio, d.nifty50, d.gold]);
  const minValue = Math.min(...allValues) * 0.95;
  const maxValue = Math.max(...allValues) * 1.05;

  // Create scale functions
  const xScale = (index: number) => (index / (timeline.length - 1)) * chartWidth;
  const yScale = (value: number) => chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

  // Create path strings for each line
  const createPath = (dataKey: keyof typeof timeline[0]) => {
    return timeline
      .map((d: any, i: number) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[dataKey] as number)}`)
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <LineChart className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Comparison</h3>
        </div>
        <div className="flex space-x-2">
          {periodOptions.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <svg width={width} height={height} className="overflow-visible">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={0}
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
            ))}
            {/* Lines */}
            {lines.map((line) => {
              // Create path for filteredTimeline
              const path = filteredTimeline
                .map((d: any, i: number) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[line.key as keyof typeof d] as number)}`)
                .join(' ');
              return (
                <path
                  key={line.key}
                  d={path}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={2}
                  className="hover:stroke-4 transition-all"
                />
              );
            })}
            {/* Data points */}
            {filteredTimeline.map((d: any, i: number) =>
              lines.map((line) => (
                <circle
                  key={`${line.key}-${i}`}
                  cx={xScale(i)}
                  cy={yScale(d[line.key as keyof typeof d] as number)}
                  r={4}
                  fill={line.color}
                  className="hover:r-6 cursor-pointer transition-all"
                />
              ))
            )}
            {/* X-axis labels */}
            {filteredTimeline.map((d: any, i: number) => {
              // Show every Nth label (e.g., every 2nd/3rd depending on length)
              const N = filteredTimeline.length > 16 ? 3 : filteredTimeline.length > 8 ? 2 : 1;
              if (i % N !== 0 && i !== filteredTimeline.length - 1 && i !== 0) return null;
              // Format date as 'MMM dd'
              const dateObj = new Date(d.date);
              const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
              return (
                <text
                  key={i}
                  x={xScale(i)}
                  y={chartHeight + 32}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                  transform={`rotate(-45 ${xScale(i)},${chartHeight + 32})`}
                >
                  {shortDate}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-6">
          {lines.map((line) => (
            <div key={line.key} className="flex items-center">
              <div className="w-4 h-0.5 mr-2" style={{ backgroundColor: line.color }} />
              <span className="text-sm text-gray-600 mr-2">{line.label}:</span>
              <span
                className={`text-sm font-semibold ${
                  returns[line.key]?.[selectedPeriod] >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {returns[line.key]?.[selectedPeriod] >= 0 ? '+' : ''}
                {returns[line.key]?.[selectedPeriod] ?? '-'}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;