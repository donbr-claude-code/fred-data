"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Area, AreaChart } from 'recharts';
import { useState, useEffect } from 'react';
import { ChartDataPoint } from '@/lib/fredApi';

// Fallback data in case API fails
const fallbackCpiData = [
  { date: 'May 2020', value: -0.1, dateNum: 0 },
  { date: 'Jul 2020', value: 0.5, dateNum: 2 },
  { date: 'Sep 2020', value: 0.2, dateNum: 4 },
  { date: 'Nov 2020', value: -0.06106, dateNum: 6 },
  { date: 'Jan 2021', value: 0.3, dateNum: 8 },
  { date: 'Mar 2021', value: 0.6, dateNum: 10 },
  { date: 'May 2021', value: 0.8, dateNum: 12 },
  { date: 'Jul 2021', value: 0.5, dateNum: 14 },
  { date: 'Sep 2021', value: 0.4, dateNum: 16 },
  { date: 'Nov 2021', value: 0.8, dateNum: 18 },
  { date: 'Jan 2022', value: 0.6, dateNum: 20 },
  { date: 'Mar 2022', value: 1.2, dateNum: 22 },
  { date: 'May 2022', value: 1.0, dateNum: 24 },
  { date: 'Jul 2022', value: 0.0, dateNum: 26 },
  { date: 'Sep 2022', value: 0.4, dateNum: 28 },
  { date: 'Nov 2022', value: 0.1, dateNum: 30 },
  { date: 'Jan 2023', value: 0.5, dateNum: 32 },
  { date: 'Mar 2023', value: 0.1, dateNum: 34 },
  { date: 'May 2023', value: 0.1, dateNum: 36 },
  { date: 'Jul 2023', value: 0.2, dateNum: 38 },
  { date: 'Sep 2023', value: 0.4, dateNum: 40 },
  { date: 'Nov 2023', value: 0.1, dateNum: 42 },
  { date: 'Jan 2024', value: 0.3, dateNum: 44 }
];

const fallbackUnemploymentData = [
  { date: 'Q1 2020', value: 3.8, dateNum: 0 },
  { date: 'Q2 2020', value: 13.2, dateNum: 1 },
  { date: 'Q3 2020', value: 8.8, dateNum: 2 },
  { date: 'Q4 2020', value: 6.8, dateNum: 3 },
  { date: 'Q1 2021', value: 6.2, dateNum: 4 },
  { date: 'Q2 2021', value: 5.9, dateNum: 5 },
  { date: 'Q3 2021', value: 5.2, dateNum: 6 },
  { date: 'Q4 2021', value: 4.2, dateNum: 7 },
  { date: 'Q1 2022', value: 3.8, dateNum: 8 },
  { date: 'Q2 2022', value: 3.6, dateNum: 9 },
  { date: 'Q3 2022', value: 3.7, dateNum: 10 },
  { date: 'Q4 2022', value: 3.5, dateNum: 11 },
  { date: 'Q1 2023', value: 3.5, dateNum: 12 },
  { date: 'Q2 2023', value: 3.6, dateNum: 13 },
  { date: 'Q3 2023', value: 3.8, dateNum: 14 },
  { date: 'Q4 2023', value: 3.7, dateNum: 15 },
  { date: 'Q1 2024', value: 3.8, dateNum: 16 },
  { date: 'Q2 2024', value: 4.0, dateNum: 17 },
  { date: 'Q3 2024', value: 4.1, dateNum: 18 },
  { date: 'Q4 2024', value: 4.2, dateNum: 19 },
  { date: 'Q1 2025', value: 4.1, dateNum: 20 }
];

const fallbackBondYieldsData = [
  { date: 'Jul 2020', value: 0.6, dateNum: 0 },
  { date: 'Sep 2020', value: 0.7, dateNum: 2 },
  { date: 'Nov 2020', value: 0.8, dateNum: 4 },
  { date: 'Jan 2021', value: 1.1, dateNum: 6 },
  { date: 'Mar 2021', value: 1.6, dateNum: 8 },
  { date: 'May 2021', value: 1.6, dateNum: 10 },
  { date: 'Jul 2021', value: 1.3, dateNum: 12 },
  { date: 'Sep 2021', value: 1.5, dateNum: 14 },
  { date: 'Nov 2021', value: 1.6, dateNum: 16 },
  { date: 'Jan 2022', value: 1.8, dateNum: 18 },
  { date: 'Mar 2022', value: 2.3, dateNum: 20 },
  { date: 'May 2022', value: 2.9, dateNum: 22 },
  { date: 'Jul 2022', value: 2.8, dateNum: 24 },
  { date: 'Sep 2022', value: 3.8, dateNum: 26 },
  { date: 'Nov 2022', value: 4.2, dateNum: 28 },
  { date: 'Jan 2023', value: 3.5, dateNum: 30 },
  { date: 'Mar 2023', value: 3.7, dateNum: 32 },
  { date: 'May 2023', value: 3.4, dateNum: 34 },
  { date: 'Jul 2023', value: 4.0, dateNum: 36 },
  { date: 'Sep 2023', value: 4.6, dateNum: 38 },
  { date: 'Nov 2023', value: 4.4, dateNum: 40 },
  { date: 'Jan 2024', value: 4.1, dateNum: 42 },
  { date: 'Mar 2024', value: 4.2, dateNum: 44 },
  { date: 'May 2024', value: 4.5, dateNum: 46 },
  { date: 'Jul 2024', value: 4.2, dateNum: 48 },
  { date: 'Sep 2024', value: 3.8, dateNum: 50 },
  { date: 'Nov 2024', value: 4.3, dateNum: 52 },
  { date: 'Jan 2025', value: 4.6, dateNum: 54 }
];

const fallbackShortTermRatesData = [
  { date: 'Jul 2020', value: 0.1, dateNum: 0 },
  { date: 'Sep 2020', value: 0.1, dateNum: 2 },
  { date: 'Nov 2020', value: 0.1, dateNum: 4 },
  { date: 'Jan 2021', value: 0.1, dateNum: 6 },
  { date: 'Mar 2021', value: 0.0, dateNum: 8 },
  { date: 'May 2021', value: 0.0, dateNum: 10 },
  { date: 'Jul 2021', value: 0.0, dateNum: 12 },
  { date: 'Sep 2021', value: 0.0, dateNum: 14 },
  { date: 'Nov 2021', value: 0.1, dateNum: 16 },
  { date: 'Jan 2022', value: 0.2, dateNum: 18 },
  { date: 'Mar 2022', value: 0.5, dateNum: 20 },
  { date: 'May 2022', value: 0.9, dateNum: 22 },
  { date: 'Jul 2022', value: 2.3, dateNum: 24 },
  { date: 'Sep 2022', value: 3.2, dateNum: 26 },
  { date: 'Nov 2022', value: 4.3, dateNum: 28 },
  { date: 'Jan 2023', value: 4.6, dateNum: 30 },
  { date: 'Mar 2023', value: 4.9, dateNum: 32 },
  { date: 'May 2023', value: 5.1, dateNum: 34 },
  { date: 'Jul 2023', value: 5.3, dateNum: 36 },
  { date: 'Sep 2023', value: 5.4, dateNum: 38 },
  { date: 'Nov 2023', value: 5.3, dateNum: 40 },
  { date: 'Jan 2024', value: 5.1, dateNum: 42 },
  { date: 'Mar 2024', value: 5.1, dateNum: 44 },
  { date: 'May 2024', value: 5.2, dateNum: 46 },
  { date: 'Jul 2024', value: 5.1, dateNum: 48 },
  { date: 'Sep 2024', value: 4.5, dateNum: 50 },
  { date: 'Nov 2024', value: 4.3, dateNum: 52 },
  { date: 'Jan 2025', value: 4.2, dateNum: 54 }
];

const navigationItems = [
  { label: 'Key Indicators', active: true, icon: '📈' },
  { label: 'Inflation', active: false, icon: '📊' },
  { label: 'Employment', active: false, icon: '👥' },
  { label: 'Interest Rates', active: false, icon: '📉' },
  { label: 'Economic Growth', active: false, icon: '📈' },
  { label: 'Exchange Rates', active: false, icon: '💱' },
  { label: 'Housing', active: false, icon: '🏠' },
  { label: 'Consumer Spending', active: false, icon: '🛒' }
];

function FREDChart({
  title,
  data,
  yAxisLabel,
  domain,
  recessionPeriods = [],
  chartType = 'line',
  fillColor,
  strokeColor = '#1565C0'
}: {
  title: string;
  data: any[];
  yAxisLabel: string;
  domain?: [number, number];
  recessionPeriods?: Array<{start: number, end: number}>;
  chartType?: 'line' | 'area';
  fillColor?: string;
  strokeColor?: string;
}) {
  // Format dates for display
  const formatDateLabel = (date: string) => {
    if (date.includes('Q')) return date; // Already formatted as quarter
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (month) {
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return date;
  };

  return (
    <div className="bg-white h-full flex flex-col border border-gray-200">
      {/* FRED Header */}
      <div className="px-4 pt-3 pb-2 bg-white">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">FRED</span>
          <span className="text-blue-500 text-lg">📈</span>
          <span className="text-blue-500 font-semibold">—</span>
          <span className="text-black text-sm font-medium">{title}</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 px-2 py-3 bg-white" style={{ minHeight: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 25, right: 40, left: 70, bottom: 50 }}>
            {/* Recession Shading */}
            {recessionPeriods.map((period, index) => (
              <ReferenceArea
                key={index}
                x1={period.start}
                x2={period.end}
                fill="#CCCCCC"
                fillOpacity={0.3}
                stroke="none"
              />
            ))}

            <CartesianGrid strokeDasharray="0" stroke="#F0F0F0" vertical={false} strokeOpacity={0.7} />
            <XAxis
              dataKey="dateNum"
              type="number"
              scale="linear"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => {
                const item = data.find(d => d.dateNum === value);
                return item ? formatDateLabel(item.date) : '';
              }}
              interval="preserveStartEnd"
              tick={{ fontSize: 11, fill: '#666' }}
              stroke="#CCCCCC"
              axisLine={{ stroke: '#E5E5E5' }}
            />
            <YAxis
              domain={domain || ['dataMin', 'dataMax']}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fontSize: 14, fill: '#333' } }}
              tick={{ fontSize: 11, fill: '#666' }}
              tickFormatter={(value) => {
                if (yAxisLabel.includes('Percent')) return value.toString();
                if (yAxisLabel.includes('Growth')) return value.toFixed(1);
                return value.toString();
              }}
              stroke="#CCCCCC"
              axisLine={{ stroke: '#E5E5E5' }}
            />
            <Tooltip
              formatter={(value: any) => [
                yAxisLabel.includes('Percent') ? `${value.toFixed(2)}%` : value.toFixed(3),
                yAxisLabel
              ]}
              labelFormatter={(value: any) => {
                const item = data.find(d => d.dateNum === value);
                return item ? item.date : '';
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {chartType === 'area' ? (
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2.5}
                fill={fillColor || strokeColor}
                fillOpacity={0.3}
                activeDot={{ r: 6 }}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2.5}
                dot={false}
                connectNulls={false}
                activeDot={{ r: 6 }}
              />
            )}
            <ReferenceLine y={0} stroke="#000000" strokeWidth={1.5} />
          </AreaChart>
          ) : (
          <LineChart data={data} margin={{ top: 25, right: 40, left: 70, bottom: 50 }}>
            {/* Recession Shading */}
            {recessionPeriods.map((period, index) => (
              <ReferenceArea
                key={index}
                x1={period.start}
                x2={period.end}
                fill="#CCCCCC"
                fillOpacity={0.3}
                stroke="none"
              />
            ))}

            <CartesianGrid strokeDasharray="0" stroke="#F0F0F0" vertical={false} strokeOpacity={0.7} />
            <XAxis
              dataKey="dateNum"
              type="number"
              scale="linear"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => {
                const item = data.find(d => d.dateNum === value);
                return item ? formatDateLabel(item.date) : '';
              }}
              interval="preserveStartEnd"
              tick={{ fontSize: 11, fill: '#666' }}
              stroke="#CCCCCC"
              axisLine={{ stroke: '#E5E5E5' }}
            />
            <YAxis
              domain={domain || ['dataMin', 'dataMax']}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fontSize: 14, fill: '#333' } }}
              tick={{ fontSize: 11, fill: '#666' }}
              tickFormatter={(value) => {
                if (yAxisLabel.includes('Percent')) return value.toString();
                if (yAxisLabel.includes('Growth')) return value.toFixed(1);
                return value.toString();
              }}
              stroke="#CCCCCC"
              axisLine={{ stroke: '#E5E5E5' }}
            />
            <Tooltip
              formatter={(value: any) => [
                yAxisLabel.includes('Percent') ? `${value.toFixed(2)}%` : value.toFixed(3),
                yAxisLabel
              ]}
              labelFormatter={(value: any) => {
                const item = data.find(d => d.dateNum === value);
                return item ? item.date : '';
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={3}
              dot={false}
              connectNulls={false}
              activeDot={{ r: 6 }}
            />
            <ReferenceLine y={0} stroke="#000000" strokeWidth={1.5} />
          </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-white border-t border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] text-gray-600">
              Source: Organization for Economic Co-operation and Development via FRED®
            </div>
            <div className="text-[11px] text-blue-500 italic">
              Shaded areas indicate U.S. recessions.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-500">fred.stlouisfed.org</span>
            <button className="text-blue-500 text-xs border border-blue-500 rounded px-2 py-0.5 hover:bg-blue-50">
              Fullscreen 🔳
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [economicData, setEconomicData] = useState<{
    cpi: ChartDataPoint[];
    unemployment: ChartDataPoint[];
    treasury10Y: ChartDataPoint[];
    treasury3M: ChartDataPoint[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/fred');
        if (!response.ok) {
          throw new Error('Failed to fetch FRED data');
        }
        const data = await response.json();
        setEconomicData(data);
      } catch (err) {
        console.error('Error fetching FRED data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Use fallback data
        setEconomicData({
          cpi: fallbackCpiData,
          unemployment: fallbackUnemploymentData,
          treasury10Y: fallbackBondYieldsData,
          treasury3M: fallbackShortTermRatesData
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const cpiData = economicData?.cpi || fallbackCpiData;
  const unemploymentData = economicData?.unemployment || fallbackUnemploymentData;
  const bondYieldsData = economicData?.treasury10Y || fallbackBondYieldsData;
  const shortTermRatesData = economicData?.treasury3M || fallbackShortTermRatesData;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🔄</span>
            <span className="text-sm text-gray-600">FRED Economic Indicators</span>
            <span className="text-sm">✕</span>
            <span className="text-sm">+</span>
          </div>
          <div className="ml-auto text-sm text-gray-600">localhost:3000</div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 p-6">
          {/* Sidebar Header */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-black mb-1">FRED Indicators</h1>
            <p className="text-gray-600 text-sm">Economic Data Dashboard</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {!item.active && <span className="text-gray-400">›</span>}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-8">
            <p className="text-xs text-gray-500">
              Data provided by Federal Reserve Economic Data (FRED)
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Content Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Economic Indicators Dashboard</h1>
            <p className="text-gray-600">Real-time economic data from the Federal Reserve Economic Data (FRED) system</p>
            {error && (
              <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <p className="text-sm">⚠️ Using fallback data. API Error: {error}</p>
              </div>
            )}
            {loading && (
              <div className="mt-2 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                <p className="text-sm">📊 Loading real-time FRED data...</p>
              </div>
            )}
            {economicData && !error && (
              <div className="mt-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="text-sm">✅ Live data from FRED API successfully loaded</p>
              </div>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6" style={{ gridAutoRows: '450px' }}>
            <FREDChart
              title="Consumer Price Index: All Items: Total for United States"
              data={cpiData}
              yAxisLabel="Growth rate, previous period"
              domain={[-1.0, 1.5]}
              recessionPeriods={[{start: 0, end: 4}]}
              chartType="line"
              strokeColor="#1565C0"
            />
            <FREDChart
              title="Infra-Annual Labor Statistics: Unemployment Rate Total: From 15 to 64 Years for United States"
              data={unemploymentData}
              yAxisLabel="Percent"
              domain={[3, 14]}
              recessionPeriods={[{start: 0, end: 1}]}
              chartType="line"
              strokeColor="#1565C0"
            />
            <FREDChart
              title="Interest Rates: Long-Term Government Bond Yields: 10-Year: Main (Including Benchmark) for United States"
              data={bondYieldsData}
              yAxisLabel="Percent"
              domain={[0, 5]}
              recessionPeriods={[{start: 0, end: 1}]}
              chartType="line"
              strokeColor="#1565C0"
            />
            <FREDChart
              title="Interest Rates: 3-Month or 90-Day Rates and Yields: Interbank Rates: Total for United States"
              data={shortTermRatesData}
              yAxisLabel="Percent"
              domain={[0, 6]}
              recessionPeriods={[{start: 0, end: 1}]}
              chartType="line"
              strokeColor="#1565C0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
