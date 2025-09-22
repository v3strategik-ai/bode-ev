import React from 'react';

const MarketSegmentsChart = () => {
  const segments = [
    { label: 'Residential', value: 45, color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Commercial', value: 30, color: '#10b981', gradient: 'from-emerald-500 to-green-500' },
    { label: 'Industrial', value: 15, color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Public', value: 10, color: '#8b5cf6', gradient: 'from-purple-500 to-indigo-500' }
  ];

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let currentAngle = -90; // Start from top

  return (
    <div className="flex flex-col items-center p-4">
      {/* Modern Pie Chart */}
      <div className="relative mb-6 group">
        <svg width="220" height="220" className="transform rotate-0 filter drop-shadow-lg">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r="85"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Gradient definitions */}
          <defs>
            {segments.map((segment, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={segment.color} />
                <stop offset="100%" stopColor={segment.color} stopOpacity="0.8" />
              </linearGradient>
            ))}
          </defs>
          
          {segments.map((segment, index) => {
            const angle = (segment.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 110 + 85 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 110 + 85 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 110 + 85 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 110 + 85 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 110 110`,
              `L ${x1} ${y1}`,
              `A 85 85 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={`url(#gradient-${index})`}
                stroke="white"
                strokeWidth="3"
                className="hover:opacity-90 transition-all duration-300 cursor-pointer filter drop-shadow-md"
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
              />
            );
          })}
          
          {/* Modern center circle */}
          <circle
            cx="110"
            cy="110"
            r="35"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="3"
            className="filter drop-shadow-lg"
          />
          <text
            x="110"
            y="105"
            textAnchor="middle"
            className="text-sm font-bold fill-gray-700"
          >
            Total
          </text>
          <text
            x="110"
            y="120"
            textAnchor="middle"
            className="text-xs fill-gray-500 font-semibold"
          >
            {total}%
          </text>
        </svg>
      </div>

      {/* Modern Legend */}
      <div className="space-y-3 w-full">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full shadow-md bg-gradient-to-br ${segment.gradient}`}
              ></div>
              <span className="text-sm font-semibold text-gray-700">
                {segment.label}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
              {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSegmentsChart;