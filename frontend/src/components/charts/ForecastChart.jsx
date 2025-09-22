import React from 'react';

const ForecastChart = () => {
  const historicalData = [
    { month: 'Jul', actual: 15.2, type: 'historical' },
    { month: 'Aug', actual: 16.8, type: 'historical' },
    { month: 'Sep', actual: 18.4, type: 'historical' },
    { month: 'Oct', actual: null, forecast: 20.2, confidence: 'high', type: 'forecast' },
    { month: 'Nov', actual: null, forecast: 21.8, confidence: 'high', type: 'forecast' },
    { month: 'Dec', actual: null, forecast: 22.1, confidence: 'medium', type: 'forecast' }
  ];

  const maxValue = Math.max(...historicalData.map(d => d.actual || d.forecast || 0));
  const chartHeight = 200;
  const chartWidth = 600;

  // Generate paths for actual and forecast data
  const actualPath = historicalData
    .filter(d => d.actual !== null)
    .map((point, index, arr) => {
      const x = (index / (historicalData.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - 40 - ((point.actual / maxValue) * (chartHeight - 80));
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

  const forecastPath = historicalData
    .filter(d => d.forecast !== null)
    .map((point, index, arr) => {
      const actualIndex = historicalData.filter(d => d.actual !== null).length - 1;
      const forecastIndex = actualIndex + index;
      const x = (forecastIndex / (historicalData.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - 40 - ((point.forecast / maxValue) * (chartHeight - 80));
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

  return (
    <div className="w-full h-64">
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="actualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <pattern id="forecastGrid" width="100" height="40" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#forecastGrid)" />

        {/* Y-axis labels */}
        {[0, 5, 10, 15, 20, 25].map((value, index) => (
          <g key={value}>
            <text
              x="10"
              y={chartHeight - 40 - (index * (chartHeight - 80) / 5)}
              fill="#6b7280"
              fontSize="12"
              textAnchor="end"
              alignmentBaseline="middle"
            >
              ${value}M
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {historicalData.map((point, index) => (
          <text
            key={point.month}
            x={(index / (historicalData.length - 1)) * (chartWidth - 40) + 20}
            y={chartHeight - 10}
            fill="#6b7280"
            fontSize="12"
            textAnchor="middle"
          >
            {point.month}
          </text>
        ))}

        {/* Historical line */}
        <path
          d={actualPath}
          fill="none"
          stroke="url(#actualGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Forecast line */}
        <path
          d={forecastPath}
          fill="none"
          stroke="url(#forecastGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6,4"
          opacity="0.8"
        />

        {/* Data points */}
        {historicalData.map((point, index) => {
          const x = (index / (historicalData.length - 1)) * (chartWidth - 40) + 20;
          const value = point.actual || point.forecast;
          const y = chartHeight - 40 - ((value / maxValue) * (chartHeight - 80));
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={point.type === 'historical' ? '#059669' : '#3b82f6'}
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              {point.type === 'forecast' && (
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke={point.confidence === 'high' ? '#10b981' : '#f59e0b'}
                  strokeWidth="2"
                  strokeDasharray="3,2"
                  opacity="0.6"
                />
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="200" height="50" fill="white" stroke="#e5e7eb" rx="4" opacity="0.95"/>
          <line x1="10" y1="15" x2="30" y2="15" stroke="#059669" strokeWidth="3"/>
          <text x="35" y="19" fill="#374151" fontSize="12">Historical Revenue</text>
          <line x1="10" y1="35" x2="30" y2="35" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,4"/>
          <text x="35" y="39" fill="#374151" fontSize="12">Forecast</text>
        </g>
      </svg>
    </div>
  );
};

export default ForecastChart;