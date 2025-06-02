"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DEFAULT_COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Teal
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#8884D8", // Purple
  "#A4DE6C", // Green
  "#D0ED57", // Lime
  "#FF6B6B", // Coral
];

export const PieChart = ({
  data,
  colors = DEFAULT_COLORS,
  innerRadius = 0,
  outerRadius = 80,
  showLabel = true,
  showLegend = true,
  showTooltip = true,
  legendPosition = "bottom",
  chartTitle,
}) => {
  return (
    <div className="flex flex-col h-full w-full">
      {chartTitle && (
        <h3 className="text-center font-medium text-lg mb-2 text-gray-700">
          {chartTitle}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            label={
              showLabel
                ? ({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                : false
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                padding: "8px 12px",
                fontSize: "14px",
              }}
              formatter={(value, name, props) => [
                value,
                `${name} (${((props.payload.percent || 0) * 100).toFixed(1)}%)`,
              ]}
            />
          )}
          {showLegend && (
            <Legend
              layout={legendPosition === "right" ? "vertical" : "horizontal"}
              verticalAlign={legendPosition === "right" ? "middle" : "bottom"}
              align="center"
              wrapperStyle={{
                paddingTop: legendPosition === "bottom" ? "16px" : "0",
              }}
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
