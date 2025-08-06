import React, { useState } from 'react';
import { Search, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface HoldingsTableProps {
  holdings: any[]; // Accept raw API data (PascalCase)
}

type SortField = 'symbol' | 'currentValue' | 'gainLoss' | 'gainLossPercentage';
type SortDirection = 'asc' | 'desc';

const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('currentValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Use camelCase holdings directly (already mapped in PortfolioDashboard)
  const filteredAndSortedHoldings = holdings
    .filter(holding =>
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }
      
      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left hover:text-gray-900 transition-colors"
    >
      <span>{children}</span>
      <ArrowUpDown className="h-4 w-4" />
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="symbol">Stock</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="currentValue">Current Value</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="gainLoss">Gain/Loss</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="gainLossPercentage">Return %</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedHoldings.map((holding) => (
              <tr
                key={holding.symbol}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {holding.symbol.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                      <div className="text-sm text-gray-500">{holding.companyName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {holding.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₹{holding.currentValue.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${
                    holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {holding.gainLoss >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {holding.gainLoss >= 0 ? '+' : ''}₹{Math.abs(holding.gainLoss).toLocaleString('en-IN')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    holding.gainLossPercentage >= 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {holding.gainLossPercentage >= 0 ? '+' : ''}{(holding.gainLossPercentage * 100).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedHoldings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No holdings found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;