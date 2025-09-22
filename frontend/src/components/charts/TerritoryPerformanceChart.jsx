import React from 'react';

const TerritoryPerformanceChart = () => {
  const territories = [
    { name: 'West Coast', revenue: 6.2, deals: 23, color: '#3b82f6' },
    { name: 'Southwest', revenue: 4.8, deals: 18, color: '#10b981' },
    { name: 'Northeast', revenue: 3.9, deals: 15, color: '#f59e0b' },
    { name: 'Southeast', revenue: 2.4, deals: 12, color: '#ef4444' },
    { name: 'Midwest', revenue: 1.4, deals: 8, color: '#8b5cf6' }
  ];

  const maxRevenue = Math.max(...territories.map(t => t.revenue));
  const chartHeight = 200;
  const chartWidth = 400;
  const barWidth = 60;
  const spacing = 20;

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <svg width={chartWidth} height={chartHeight} className="overflow-visible">
        {territories.map((territory, index) => {
          const barHeight = (territory.revenue / maxRevenue) * (chartHeight - 60);
          const x = index * (barWidth + spacing) + spacing;
          const y = chartHeight - barHeight - 40;
          
          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={territory.color}
                rx="4"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              
              {/* Revenue label on top */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs font-semibold fill-gray-700"
              >
                ${territory.revenue}M
              </text>
              
              {/* Territory name */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {territory.name.split(' ')[0]}
              </text>
              
              {/* Deals count */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 5}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {territory.deals} deals
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default TerritoryPerformanceChart;