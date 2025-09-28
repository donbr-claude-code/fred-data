# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a FRED (Federal Reserve Economic Data) economic indicators dashboard built with Next.js 15. It displays real-time economic data including CPI, unemployment rates, and Treasury bond yields in professional chart visualizations that match FRED's styling.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build production version with Turbopack
npm run build

# Start production server
npm start
```

## Core Architecture

### Application Structure
- **Next.js 15 App Router**: Uses the new app directory structure with TypeScript
- **Client-Side Dashboard**: Main page (`app/page.tsx`) renders economic indicator charts
- **API Integration**: Server-side API route (`app/api/fred/route.ts`) fetches data from FRED API
- **Data Layer**: FRED API service module (`lib/fredApi.ts`) handles all external data fetching

### Data Flow
1. Frontend requests data from `/api/fred` endpoint
2. API route calls `getAllEconomicData()` from fredApi service
3. Service makes parallel requests to FRED API for 4 indicators:
   - CPI (Consumer Price Index) - monthly percent change
   - Unemployment Rate - quarterly data
   - 10-Year Treasury Yields - monthly data
   - 3-Month Treasury Rates - monthly data
4. Data is transformed into chart-compatible format with fallback handling
5. Recharts components render professional FRED-style visualizations

### Key Dependencies
- **Next.js 15**: Framework with Turbopack bundler
- **React 19**: Frontend library
- **Recharts**: Chart visualization library for economic data
- **Tailwind CSS 4**: Styling framework
- **TypeScript 5**: Type safety

## API Configuration

### Environment Variables
Copy `.env.example` to `.env` and add:
```bash
FRED_API_KEY=your-fred-api-key-here
```

Get a free API key from: https://fred.stlouisfed.org/docs/api/api_key.html

### FRED API Integration
- Base URL: `https://api.stlouisfed.org/fred/series/observations`
- Series IDs defined in `lib/fredApi.ts` for key economic indicators
- Built-in error handling with fallback data when API is unavailable
- Supports various data transformations (units, frequency, date ranges)

## Component Architecture

### Chart System
- **FREDChart Component**: Reusable chart wrapper with FRED styling
- **Recharts Integration**: LineChart and AreaChart with professional formatting
- **Recession Shading**: Gray overlay areas to indicate economic recessions
- **Interactive Features**: Tooltips, hover states, and responsive design

### Data Types
```typescript
interface ChartDataPoint {
  date: string;      // Human-readable date
  value: number;     // Numeric value
  dateNum: number;   // Sequential number for chart positioning
}
```

## Styling Approach

- **FRED-Authentic Design**: Matches official FRED chart styling
- **Tailwind CSS**: Utility-first CSS framework
- **Component-Scoped Styling**: Chart components include FRED branding
- **Responsive Layout**: Grid system adapts to different screen sizes

## Error Handling Strategy

- **Graceful Degradation**: Falls back to static data when FRED API unavailable
- **User Feedback**: Visual indicators show data source status (live vs fallback)
- **API Error Logging**: Server-side logging for debugging API issues
- **Type Safety**: TypeScript interfaces prevent data structure issues

## MCP Server Integration

This project was built using Model Context Protocol (MCP) servers for enhanced development capabilities:

### Figma Integration

- **Framelink Figma MCP**: Used to analyze the original Figma mockup and implement the UI design
- Original design: [Figma Key Indicators Mockup](https://www.figma.com/design/b37Gdw0ambKq2isyUR6kCH/key-indicators?node-id=0-1&p=f&t=CU0XokgLseRxK1WL-0)
- MCP server enables direct Figma design analysis and code generation from mockups

### Testing with Playwright MCP

- **Playwright MCP**: Automated browser testing to verify UI matches the original design
- Use for visual regression testing and component behavior validation
- Helps ensure the implementation matches the Figma design specifications

### MCP Configuration

Reference `reference/L8_notes.md` for detailed MCP server setup instructions including:

- Framelink Figma MCP server configuration
- Playwright MCP server setup
- Alternative Figma official MCP server (requires Dev Mode subscription)

## Development Workflow

The project follows a design-first development approach:

1. **Design Analysis**: Figma MCP analyzes the original mockup
2. **Implementation**: Build components matching the design specifications
3. **Data Integration**: Connect charts to real FRED API data
4. **Validation**: Use Playwright MCP to verify visual accuracy

## Development Notes

- All economic data requests happen server-side to protect API keys
- Charts use sequential numbering (dateNum) for proper X-axis spacing
- Fallback data is embedded in frontend for offline development
- Environment variable validation prevents runtime API errors
- Path alias `@/*` maps to project root for clean imports
- Professional FRED styling maintains visual consistency with official economic data presentations