import React from 'react';

const RevenueChart = () => {
  // Mock data points for the revenue trend
  const dataPoints = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 48000 },
    { month: 'Mar', value: 52000 },
    { month: 'Apr', value: 49000 },
    { month: 'May', value: 46000 },
    { month: 'Jun', value: 60000 }
  ];

  const maxValue = Math.max(...dataPoints.map(d => d.value));
  const chartHeight = 200;
  const chartWidth = 600;

  // Generate path for the line chart
  const pathData = dataPoints.map((point, index) => {
    const x = (index / (dataPoints.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - 40 - ((point.value / maxValue) * (chartHeight - 80));
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full h-64 p-4">
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
        {/* Modern grid lines */}
        <defs>
          <pattern id="modernGrid" width="100" height="40" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#modernGrid)" />

        {/* Y-axis labels */}
        {[0, 20000, 40000, 60000, 80000].map((value, index) => (
          <g key={value}>
            <text
              x="10"
              y={chartHeight - 40 - (index * (chartHeight - 80) / 4)}
              fill="#6b7280"
              fontSize="12"
              textAnchor="end"
              alignmentBaseline="middle"
            >
              {value.toLocaleString()}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {dataPoints.map((point, index) => (
          <text
            key={point.month}
            x={(index / (dataPoints.length - 1)) * (chartWidth - 40) + 20}
            y={chartHeight - 10}
            fill="#6b7280"
            fontSize="12"
            textAnchor="middle"
          >
            {point.month}
          </text>
        ))}

        {/* Modern revenue line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#chartGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 4px 6px rgba(16, 185, 129, 0.2))"
        />

        {/* Modern data points */}
        {dataPoints.map((point, index) => {
          const x = (index / (dataPoints.length - 1)) * (chartWidth - 40) + 20;
          const y = chartHeight - 40 - ((point.value / maxValue) * (chartHeight - 80));
          return (
            <g key={index} className="group">
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="white"
                stroke="url(#chartGradient)"
                strokeWidth="3"
                className="drop-shadow-lg hover:r-8 transition-all duration-300"
              />
              <circle
                cx={x}
                cy={y}
                r="3"
                fill="url(#chartGradient)"
              />
            </g>
          );
        })}

        {/* Modern area under curve */}
        <path
          d={`${pathData} L ${(dataPoints.length - 1) * (chartWidth - 40) / (dataPoints.length - 1) + 20} ${chartHeight - 40} L 20 ${chartHeight - 40} Z`}
          fill="url(#areaGradient)"
        />
      </svg>
    </div>
  );
};

export default RevenueChart;