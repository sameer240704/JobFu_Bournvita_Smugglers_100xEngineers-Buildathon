"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const BarChart = ({ data, xKey, yKey, color = "#6366f1" }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#64748b" }}
          axisLine={{ stroke: "#64748b" }}
        />
        <YAxis tick={{ fill: "#64748b" }} axisLine={{ stroke: "#64748b" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderColor: "#e2e8f0",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
