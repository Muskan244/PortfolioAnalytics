import React, { useState } from 'react';
import { PieChart } from 'lucide-react';

interface AssetAllocationProps {
  data: any;
}

const AssetAllocation: React.FC<AssetAllocationProps> = ({ data }) => {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  // Calculate sector distribution
  const sectorArray = data?.bySector
    ? Object.entries(data.bySector).map(([sector, v]: [String, any], idx) => ({
      sector,
      value: typeof v.value === 'string' ? Number(v.value.replace(/,/g, '')) : v.value,
      percentage: v.percentage * 100,
      color: `hsl(${idx * 45}, 70%, 55%)`,
    }))
    : [];

  // Calculate market cap distribution
  const marketCapArray = data?.byMarketCap
    ? Object.entries(data.byMarketCap).map(([cap, v]: [String, any], idx) => ({
      sector: cap, // Use 'sector' key for consistency with PieChartSVG
      value: typeof v.value === 'string' ? Number(v.value.replace(/,/g, '')) : v.value,
      percentage: v.percentage * 100.0,
      color: `hsl(${200 + idx * 30}, 60%, 50%)`,
    }))
    : [];

  const PieChartSVG: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
    // If only one nonzero segment, render a donut with label
    const nonzero = data.filter(item => item.value > 0);
    if (nonzero.length === 1) {
      const item = nonzero[0];
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <PieChart className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg width="256" height="256" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="100" fill={item.color} />
              <circle cx="128" cy="128" r="60" fill="white" />
            </svg>
            <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{item.sector || item.label || title}</span>
              <span className="text-2xl font-bold text-gray-800 mt-2">₹{item.value.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-500 mt-1">{item.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    let cumulativePercentage = 0;

    const createArc = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <PieChart className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="flex flex-row items-center">
          <div className="w-64 h-64 mr-8">
            <svg width="256" height="256" viewBox="0 0 256 256">
              {data.map((item, index) => {
                const startAngle = cumulativePercentage * 3.6;
                const endAngle = (cumulativePercentage + item.percentage) * 3.6;
                cumulativePercentage += item.percentage;

                return (
                  <path
                    key={index}
                    d={createArc(128, 128, 100, startAngle, endAngle)}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    onMouseEnter={() => setHoveredSector(item.sector)}
                    onMouseLeave={() => setHoveredSector(null)}
                  />
                );
              })}
              <circle cx="128" cy="128" r="40" fill="white" />
            </svg>
          </div>

          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  hoveredSector === item.sector ? 'bg-gray-50 scale-105' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-700">{item.sector}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₹{item.value.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PieChartSVG data={sectorArray} title="Sector Distribution" />
      <PieChartSVG data={marketCapArray} title="Market Cap Distribution" />
    </div>
  );
};

export default AssetAllocation;