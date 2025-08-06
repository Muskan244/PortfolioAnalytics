import React from 'react';
import { Trophy, TrendingDown, Shield, AlertTriangle } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface TopPerformersProps {
  holdings: Holding[];
  diversificationScore: number;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ holdings, diversificationScore }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="p-6 text-gray-500 text-center">
        No holdings data available.
      </div>
    );
  }

  // Find best and worst performers
  const bestPerformer = holdings.reduce(
    (best, current) =>
      current.gainLossPercentage > best.gainLossPercentage ? current : best,
    holdings[0]
  );

  const worstPerformer = holdings.reduce(
    (worst, current) =>
      current.gainLossPercentage < worst.gainLossPercentage ? current : worst,
    holdings[0]
  );

  // Use backend diversificationScore if provided, else fallback to frontend calculation
  const uniqueSectors = new Set(holdings.map(h => h.sector));
  const calculatedDiversificationScore = Math.min((uniqueSectors.size / 8) * 100, 100); // Assuming 8 major sectors
  const scoreToShow = diversificationScore !== undefined ? diversificationScore : calculatedDiversificationScore;

  // Calculate risk level based on portfolio concentration
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const largestHolding = Math.max(...holdings.map(h => h.currentValue));
  const concentration = (largestHolding / totalValue) * 100;
  
  const getRiskLevel = () => {
    if (concentration > 50) return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (concentration > 30) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  // Set risk level to Moderate (yellow) as per user request
  const risk = { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Best Performer</h3>
              <p className="text-sm text-gray-600">Highest returns</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mr-4">
                <span className="text-lg font-bold text-white">
                  {bestPerformer.symbol.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">{bestPerformer.symbol}</div>
                <div className="text-sm text-gray-600">{bestPerformer.companyName}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div>
                <div className="text-sm text-gray-600">Gain</div>
                <div className="text-xl font-bold text-green-600">
                  +₹{bestPerformer.gainLoss.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Return</div>
                <div className="text-xl font-bold text-green-600">
                  +{(bestPerformer.gainLossPercentage * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Worst Performer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Worst Performer</h3>
              <p className="text-sm text-gray-600">Needs attention</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center mr-4">
                <span className="text-lg font-bold text-white">
                  {worstPerformer.symbol.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">{worstPerformer.symbol}</div>
                <div className="text-sm text-gray-600">{worstPerformer.companyName}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div>
                <div className="text-sm text-gray-600">Loss</div>
                <div className="text-xl font-bold text-red-600">
                  ₹{Math.abs(worstPerformer.gainLoss).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Return</div>
                <div className="text-xl font-bold text-red-600">
                  {(worstPerformer.gainLossPercentage * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diversification Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Diversification Score</h3>
              <p className="text-sm text-gray-600">Portfolio spread</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-blue-600">
                {scoreToShow.toFixed(0)}
              </span>
              <span className="text-lg text-gray-600 pb-1">/100</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${diversificationScore}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              {diversificationScore >= 70 ? 'Well diversified portfolio' :
               diversificationScore >= 50 ? 'Moderately diversified' : 'Consider diversifying more'}
            </p>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-lg ${risk.bgColor}`}>
              <AlertTriangle className={`h-6 w-6 ${risk.color}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Level</h3>
              <p className="text-sm text-gray-600">Portfolio concentration</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-bold ${risk.color}`}>
                {risk.level}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${risk.bgColor} ${risk.color}`}>
                {concentration.toFixed(1)}% in largest holding
              </span>
            </div>
            
            <p className="text-sm text-gray-600">
              {risk.level === 'High' ? 'Consider reducing concentration in largest holdings' :
               risk.level === 'Medium' ? 'Balanced portfolio concentration' :
               'Good distribution across holdings'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;