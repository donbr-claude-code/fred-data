import { NextResponse } from 'next/server';
import { getAllEconomicData } from '@/lib/fredApi';

export async function GET() {
  try {
    const data = await getAllEconomicData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch economic data' },
      { status: 500 }
    );
  }
}