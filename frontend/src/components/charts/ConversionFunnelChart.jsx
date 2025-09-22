import React from 'react';

const ConversionFunnelChart = () => {
  const funnelData = [
    { stage: 'Leads', count: 1247, percentage: 100, color: '#3b82f6' },
    { stage: 'Qualified', count: 842, percentage: 67.5, color: '#10b981' },
    { stage: 'Proposals', count: 534, percentage: 42.8, color: '#f59e0b' },
    { stage: 'Negotiations', count: 398, percentage: 31.9, color: '#ef4444' },
    { stage: 'Closed Won', count: 287, percentage: 23.0, color: '#8b5cf6' }
  ];

  const chartHeight = 300;
  const chartWidth = 280;
  const maxWidth = 240;

  return (
    <div className="w-full flex flex-col items-center">
      <svg width={chartWidth} height={chartHeight} className="mb-4">
        <defs>
          {funnelData.map((stage, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={stage.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={stage.color} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>
        
        {funnelData.map((stage, index) => {
          const segmentHeight = chartHeight / funnelData.length;
          const y = index * segmentHeight;
          const width = (stage.percentage / 100) * maxWidth;
          const x = (chartWidth - width) / 2;
          
          // Create trapezoid shape for funnel effect
          const nextWidth = index < funnelData.length - 1 
            ? (funnelData[index + 1].percentage / 100) * maxWidth 
            : width * 0.8;
          const nextX = (chartWidth - nextWidth) / 2;
          
          const pathData = `
            M ${x} ${y}
            L ${x + width} ${y}
            L ${nextX + nextWidth} ${y + segmentHeight}
            L ${nextX} ${y + segmentHeight}
            Z
          `;
          
          return (
            <g key={index}>
              <path
                d={pathData}
                fill={`url(#gradient-${index})`}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              
              {/* Stage labels */}
              <text
                x={chartWidth / 2}
                y={y + segmentHeight / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize="14"
                fontWeight="600"
                className="drop-shadow-sm"
              >
                {stage.count}
              </text>
              
              {/* Stage names */}
              <text
                x={chartWidth / 2}
                y={y + segmentHeight / 2 + 15}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize="11"
                fontWeight="500"
                className="drop-shadow-sm"
              >
                {stage.stage}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Conversion rates between stages */}
      <div className="space-y-2 w-full">
        {funnelData.map((stage, index) => {
          if (index === funnelData.length - 1) return null;
          
          const nextStage = funnelData[index + 1];
          const conversionRate = ((nextStage.count / stage.count) * 100).toFixed(1);
          
          return (
            <div key={index} className="flex justify-between items-center text-xs bg-gray-50 px-3 py-2 rounded">
              <span className="text-gray-600">
                {stage.stage} → {nextStage.stage}
              </span>
              <span className="font-semibold text-gray-900">
                {conversionRate}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Overall conversion rate */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg w-full text-center">
        <div className="text-lg font-bold text-gray-900">
          {((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(1)}%
        </div>
        <div className="text-xs text-gray-600">Overall Conversion Rate</div>
      </div>
    </div>
  );
};

export default ConversionFunnelChart;