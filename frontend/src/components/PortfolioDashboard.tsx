import React, { useEffect, useState } from 'react';
import OverviewCards from './OverviewCards';
import AssetAllocation from './AssetAllocation';
import HoldingsTable from './HoldingsTable';
import PerformanceChart from './PerformanceChart';
import TopPerformers from './TopPerformers';
import { fetchAPI } from '../api';

function mapHoldingKeys(holding: any) {
  return {
    symbol: holding.Symbol,
    companyName: holding.CompanyName,
    quantity: holding.Quantity,
    avgPrice: holding.AvgPrice,
    currentPrice: holding.CurrentPrice,
    sector: holding.Sector,
    marketCap: holding.MarketCap,
    exchange: holding.Exchange,
    currentValue: holding.Value,
    gainLoss: holding.GainorLoss,
    gainLossPercentage: holding.GainorLossPercentage,
  };
}

const PortfolioDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [summaryData, holdingsData, allocationData, performanceData] = await Promise.all([
          fetchAPI('/api/portfolio/summary/'),
          fetchAPI('/api/portfolio/holdings/'),
          fetchAPI('/api/portfolio/allocation/'),
          fetchAPI('/api/portfolio/performance/')
        ]);
        setSummary(summaryData);
        setHoldings(holdingsData);
        setAllocation(allocationData);
        setPerformance(performanceData);
      } catch (err) {
        // handle error (show error message, etc.)
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your investments and performance</p>
      </div>

      {/* Overview Cards */}
      <div className="mb-8">
        <OverviewCards data={summary} holdings={holdings} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AssetAllocation data={allocation} />
        <PerformanceChart data={performance} />
      </div>

      {/* Holdings Table */}
      <div className="mb-8">
        <HoldingsTable holdings={holdings.map(mapHoldingKeys)} />
      </div>

      {/* Top Performers */}
      <TopPerformers holdings={holdings.map(mapHoldingKeys)} diversificationScore={summary?.diversificationScore} />
    </div>
  );
};

export default PortfolioDashboard;