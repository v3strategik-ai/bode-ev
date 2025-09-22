import React from 'react';

const MarketSegmentsChart = () => {
  const segments = [
    { label: 'Residential', value: 45, color: '#3b82f6' },
    { label: 'Commercial', value: 30, color: '#10b981' },
    { label: 'Industrial', value: 15, color: '#f59e0b' },
    { label: 'Public', value: 10, color: '#8b5cf6' }
  ];

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let currentAngle = -90; // Start from top

  return (
    <div className="flex flex-col items-center">
      {/* Pie Chart */}
      <div className="relative mb-4">
        <svg width="200" height="200" className="transform rotate-0">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="2"
          />
          {segments.map((segment, index) => {
            const angle = (segment.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          
          {/* Center circle */}
          <circle
            cx="100"
            cy="100"
            r="30"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-700"
          >
            Total
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {total}%
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            ></div>
            <span className="text-sm text-gray-600">
              {segment.label} ({segment.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSegmentsChart;