"use client";
import React from "react";

// Remove the d3 imports and create separate components for each chart type
import { DonutChart } from "@/components/charts/DonutChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { AreaChart } from "@/components/charts/AreaChart";
import { LineChart } from "@/components/charts/LineChart";

const AnalyticsPage = () => {
  const data = {
    acceptanceRate: {
      accepted: 68,
      rejected: 32,
    },
    locationData: [
      { location: "San Francisco", count: 156 },
      { location: "New York", count: 142 },
      { location: "London", count: 98 },
      { location: "Singapore", count: 76 },
      { location: "Toronto", count: 64 },
    ],
    jobTypes: [
      { type: "Software Engineer", count: 245 },
      { type: "Product Manager", count: 128 },
      { type: "Data Scientist", count: 112 },
      { type: "DevOps Engineer", count: 89 },
      { type: "UX Designer", count: 76 },
    ],
    sales: [
      { date: "2023-05-04", value: 10 },
      { date: "2023-05-05", value: 12 },
      { date: "2023-05-06", value: 10.5 },
      { date: "2023-05-07", value: 6 },
      { date: "2023-05-13", value: 10 },
      { date: "2023-05-14", value: 17 },
      { date: "2023-05-15", value: 14 },
      { date: "2023-05-16", value: 15 },
      { date: "2023-05-17", value: 20 },
      { date: "2023-05-18", value: 18 },
      { date: "2023-05-19", value: 16 },
      { date: "2023-05-20", value: 15 },
      { date: "2023-05-21", value: 16 },
      { date: "2023-05-22", value: 13 },
      { date: "2023-05-23", value: 11 },
      { date: "2023-05-24", value: 11 },
      { date: "2023-05-25", value: 13 },
      { date: "2023-05-26", value: 12 },
      { date: "2023-05-27", value: 9 },
      { date: "2023-05-28", value: 8 },
      { date: "2023-05-29", value: 10 },
      { date: "2023-05-30", value: 11 },
      { date: "2023-05-31", value: 8 },
      { date: "2023-06-01", value: 9 },
      { date: "2023-06-02", value: 10 },
      { date: "2023-06-03", value: 12 },
      { date: "2023-06-04", value: 13 },
      { date: "2023-06-05", value: 15 },
      { date: "2023-06-06", value: 13.5 },
      { date: "2023-06-07", value: 13 },
      { date: "2023-06-08", value: 13 },
      { date: "2023-06-09", value: 14 },
      { date: "2023-06-10", value: 13 },
      { date: "2023-06-11", value: 12.5 },
    ],
    retentionRate: [
      { date: "2023-05-01", value: 6 },
      { date: "2023-05-02", value: 8 },
      { date: "2023-05-03", value: 7 },
      { date: "2023-05-04", value: 10 },
      { date: "2023-05-05", value: 12 },
      { date: "2023-05-06", value: 11 },
      { date: "2023-05-07", value: 8 },
      { date: "2023-05-09", value: 9 },
    ],
    keyMetrics: [
      { metric: "Avg. Time to Hire", value: "18 days" },
      { metric: "Offer Acceptance Rate", value: "89%" },
      { metric: "Interview Success Rate", value: "42%" },
      { metric: "Candidate Satisfaction", value: "4.6/5" },
    ],
  };

  return (
    <div className=" p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-8">
        Recruitment Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Application Status</h2>
          <div className="">
            <DonutChart
              data={[
                { name: "Accepted", value: data.acceptanceRate.accepted },
                { name: "Rejected", value: data.acceptanceRate.rejected },
              ]}
              colors={["#4ade80", "#f87171"]}
            />
          </div>
        </div>

        {/* Location Density - Horizontal Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Location Distribution</h2>
          <div className="">
            <HorizontalBarChart
              data={data.locationData.map((item) => ({
                key: item.location,
                value: item.count,
              }))}
            />
          </div>
        </div>

        {/* Job Types - Vertical Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Job Types Applied</h2>
          <div>
            <VerticalBarChart
              data={data.jobTypes.map((item) => ({
                key: item.type,
                value: item.count,
              }))}
              color="#a78bfa"
            />
          </div>
        </div>

        {/* Experience Distribution - Area Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Years of Experience Distribution
          </h2>
          <div>
            <AreaChart
              sales={data.sales.map((item) => ({
                date: item.date,
                value: item.value,
              }))}
            />
          </div>
        </div>

        {/* Retention Rate - Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Retention Rate Trend</h2>
          <div className="h-64">
            <LineChart
              sales={data.retentionRate.map((item) => ({
                date: item.date,
                value: item.rate,
              }))}
            />
          </div>
        </div>

        {/* Key Metrics - Grid */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Key Takeaways</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.keyMetrics.map((metric) => (
              <div
                key={metric.metric}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-600">{metric.metric}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
