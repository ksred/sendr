'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

const generateMockData = (days: number): PricePoint[] => {
  const data: PricePoint[] = [];
  const basePrice = 1.0850; // EUR/USD base price
  const now = new Date();
  const seed = days; // Use days as seed for consistent generation

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Use deterministic random based on seed and index
    const pseudoRandom = Math.sin(seed * i) * 10000 - Math.floor(Math.sin(seed * i) * 10000);
    const randomChange = (pseudoRandom - 0.5) * 0.0020; // Max 20 pips movement
    const price = basePrice + (randomChange * (days - i));
    
    // Generate deterministic volume
    const volume = Math.floor(Math.sin(seed * (i + 1)) * 500000) + 750000;

    data.push({
      timestamp: date.toISOString().split('T')[0],
      price: Number(price.toFixed(4)),
      volume: volume,
    });
  }

  return data;
};

interface MarketChartProps {
  symbol: string;
  currency: string;
}

export default function MarketChart({ symbol, currency }: MarketChartProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1W');
  const [chartData, setChartData] = useState<PricePoint[]>([]);

  useEffect(() => {
    const days = timeframe === '1D' ? 1 : timeframe === '1W' ? 7 : 30;
    setChartData(generateMockData(days));
  }, [timeframe]);

  const timeframeButtons = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
  ];

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-[300px] bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{symbol}</h2>
          <p className="text-sm text-gray-500">
            {formatCurrency(chartData[chartData.length - 1].price, currency)}
          </p>
        </div>
        <div className="flex gap-2">
          {timeframeButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTimeframe(value as typeof timeframe)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === value
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              domain={['dataMin - 0.0010', 'dataMax + 0.0010']}
              tickFormatter={(value) => value.toFixed(4)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border rounded-lg shadow p-2">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(payload[0].value, currency)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payload[0].payload.timestamp}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
