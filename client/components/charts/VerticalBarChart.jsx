import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";
import { motion } from "framer-motion";

export function VerticalBarChart({ data, color }) {
  const minBars = 5;
  const filledData = [
    ...data,
    // Add empty bars to make the chart look better for small datasets
    ...Array.from({ length: Math.max(0, minBars - data.length) }, (_, i) => ({
      key: `Empty ${i + 1}`,
      value: 0,
    })),
  ];
  // Scales
  const xScale = scaleBand()
    .domain(filledData.map((d) => d.key))
    .range([0, 100])
    .padding(0.3);

  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  return (
    <div
      className="relative h-72 w-full grid"
      style={{
        "--marginTop": "0px",
        "--marginRight": "25px",
        "--marginBottom": "56px",
        "--marginLeft": "25px",
      }}
    >
      {/* Y axis */}
      <div
        className="relative
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {yScale
          .ticks(8)
          .map(yScale.tickFormat(8, "d"))
          .map((value, i) => (
            <div
              key={i}
              style={{
                top: `${yScale(+value)}%`,
              }}
              className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-300 w-full text-right pr-2"
            >
              {value}
            </div>
          ))}
      </div>

      {/* Chart Area */}
      <div
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {yScale
            .ticks(8)
            .map(yScale.tickFormat(8, "d"))
            .map((active, i) => (
              <g
                transform={`translate(0,${yScale(+active)})`}
                className="text-gray-300/80 dark:text-gray-800/80"
                key={i}
              >
                <line
                  x1={0}
                  x2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
        </svg>

        {/* X Axis (Labels) */}
        {data.map((entry, i) => {
          const xPosition = xScale(entry.key) + xScale.bandwidth() / 2;

          return (
            <div
              key={i}
              className="absolute overflow-visible text-gray-400"
              style={{
                left: `${xPosition}%`,
                top: "100%",
                transform: "rotate(0deg) translateX(-30px) translateY(8px)",
              }}
            >
              <div
                className={`absolute text-xs -translate-y-1/2 whitespace-nowrap`}
              >
                {entry.key?.slice(0, 10) +
                  (entry.key?.length > 10 ? "..." : "")}
              </div>
            </div>
          );
        })}

        {/* Bars */}
        {filledData.map((d, index) => {
          const barWidth = xScale.bandwidth();
          const barHeight = 100 - yScale(d.value);
          return (
            <motion.div
              key={index}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${barHeight}%`, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              style={{
                left: `${xScale(d.key)}%`,
                bottom: 0,
                width: `${xScale.bandwidth()}%`,
              }}
              className="absolute bg-blue-300 dark:bg-blue-400 rounded-t-md"
            
            />
          );
        })}
      </div>
    </div>
  );
}
