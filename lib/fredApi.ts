// FRED API Service Module
// Documentation: https://fred.stlouisfed.org/docs/api/fred/

interface FredObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

interface FredResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FredObservation[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  dateNum: number;
}

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.FRED_API_KEY;

// Common FRED Series IDs for economic indicators
export const FRED_SERIES = {
  CPI: 'CPIAUCSL', // Consumer Price Index for All Urban Consumers: All Items in U.S. City Average
  CPI_GROWTH: 'CPIAUCSL', // We'll calculate growth rate from this
  UNEMPLOYMENT: 'UNRATE', // Unemployment Rate
  TREASURY_10Y: 'DGS10', // 10-Year Treasury Constant Maturity Rate
  TREASURY_3M: 'DGS3MO', // 3-Month Treasury Constant Maturity Rate
} as const;

class FredApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'FredApiError';
  }
}

async function fetchFredData(
  seriesId: string,
  options: {
    startDate?: string;
    endDate?: string;
    units?: 'lin' | 'chg' | 'pch' | 'pca'; // linear, change, percent change, percent change annualized
    frequency?: 'm' | 'q' | 'a'; // monthly, quarterly, annual
  } = {}
): Promise<FredResponse> {
  if (!API_KEY) {
    throw new FredApiError('FRED API key not found in environment variables');
  }

  const url = new URL(FRED_BASE_URL);
  url.searchParams.set('series_id', seriesId);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('file_type', 'json');

  if (options.startDate) {
    url.searchParams.set('observation_start', options.startDate);
  }
  if (options.endDate) {
    url.searchParams.set('observation_end', options.endDate);
  }
  if (options.units) {
    url.searchParams.set('units', options.units);
  }
  if (options.frequency) {
    url.searchParams.set('frequency', options.frequency);
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new FredApiError(
        `FRED API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof FredApiError) {
      throw error;
    }
    throw new FredApiError(`Failed to fetch FRED data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function transformToChartData(fredResponse: FredResponse): ChartDataPoint[] {
  return fredResponse.observations
    .filter(obs => obs.value !== '.')  // Filter out missing values
    .map((obs, index) => ({
      date: obs.date,
      value: parseFloat(obs.value),
      dateNum: index
    }));
}

// Specific data fetchers for each chart
export async function getCpiData(): Promise<ChartDataPoint[]> {
  try {
    const response = await fetchFredData(FRED_SERIES.CPI, {
      startDate: '2020-05-01',
      endDate: '2024-12-31',
      units: 'pch', // Percent change from previous period
      frequency: 'm' // Monthly data
    });

    return transformToChartData(response);
  } catch (error) {
    console.error('Failed to fetch CPI data:', error);
    throw error;
  }
}

export async function getUnemploymentData(): Promise<ChartDataPoint[]> {
  try {
    const response = await fetchFredData(FRED_SERIES.UNEMPLOYMENT, {
      startDate: '2020-01-01',
      endDate: '2024-12-31',
      frequency: 'm' // Monthly data, even though we'll group quarterly
    });

    const chartData = transformToChartData(response);

    // Convert to quarterly data by taking the last month of each quarter
    const quarterlyData: ChartDataPoint[] = [];
    const quarters = ['03', '06', '09', '12']; // March, June, September, December

    chartData.forEach((point, index) => {
      const month = point.date.split('-')[1];
      if (quarters.includes(month)) {
        const year = parseInt(point.date.split('-')[0]);
        const quarter = quarters.indexOf(month) + 1;
        quarterlyData.push({
          ...point,
          date: `Q${quarter} ${year}`,
          dateNum: quarterlyData.length
        });
      }
    });

    return quarterlyData;
  } catch (error) {
    console.error('Failed to fetch unemployment data:', error);
    throw error;
  }
}

export async function get10YearTreasuryData(): Promise<ChartDataPoint[]> {
  try {
    const response = await fetchFredData(FRED_SERIES.TREASURY_10Y, {
      startDate: '2020-07-01',
      endDate: '2024-12-31',
      frequency: 'm' // Monthly data
    });

    return transformToChartData(response);
  } catch (error) {
    console.error('Failed to fetch 10-year treasury data:', error);
    throw error;
  }
}

export async function get3MonthTreasuryData(): Promise<ChartDataPoint[]> {
  try {
    const response = await fetchFredData(FRED_SERIES.TREASURY_3M, {
      startDate: '2020-07-01',
      endDate: '2024-12-31',
      frequency: 'm' // Monthly data
    });

    return transformToChartData(response);
  } catch (error) {
    console.error('Failed to fetch 3-month treasury data:', error);
    throw error;
  }
}

// Utility function to get all data for the dashboard
export async function getAllEconomicData() {
  try {
    const [cpiData, unemploymentData, treasury10Y, treasury3M] = await Promise.all([
      getCpiData(),
      getUnemploymentData(),
      get10YearTreasuryData(),
      get3MonthTreasuryData()
    ]);

    return {
      cpi: cpiData,
      unemployment: unemploymentData,
      treasury10Y,
      treasury3M
    };
  } catch (error) {
    console.error('Failed to fetch economic data:', error);
    throw error;
  }
}