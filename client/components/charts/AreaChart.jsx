import {
  scaleTime,
  scaleLinear,
  line as d3line,
  max,
  area as d3area,
  curveMonotoneX,
} from "d3";
import { motion } from "framer-motion";

export function AreaChart({ sales }) {
  const data = sales.map((d) => ({ ...d, date: new Date(d.date) }));
  let xScale = scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, 100]);

  let yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  let line = d3line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(curveMonotoneX);

  let area = d3area()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.value))
    .curve(curveMonotoneX);

  let areaPath = area(data) ?? undefined;

  let d = line(data);

  if (!d) {
    return null;
  }

  return (
    <div
      className="relative h-72 w-full"
      style={{
        "--marginTop": "0px",
        "--marginRight": "10px",
        "--marginBottom": "15px",
        "--marginLeft": "0px",
      }}
    >
      {/* Chart area */}
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
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Area */}
          <path
            d={areaPath}
            className="text-purple-200 dark:text-purple-400"
            fill="currentColor"
          />

          {/* Line */}
          <path
            d={d}
            fill="none"
            className="text-gray-50 dark:text-zinc-800"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* X Axis */}
        <div className="translate-y-1">
          {data.map((day, i) => {
            const isFirst = i === 0;
            const isLast = i === data.length - 1;
            const isMax = day.value === Math.max(...data.map((d) => d.value));
            if (!isFirst && !isLast && !isMax) return null;
            return (
              <div key={i} className="overflow-visible text-zinc-500">
                <div
                  style={{
                    left: `${xScale(day.date)}%`,
                    top: "100%",
                    transform: `translateX(${
                      i === 0 ? "0%" : i === data.length - 1 ? "-100%" : "-50%"
                    })`, // The first and last labels should be within the chart area
                  }}
                  className="text-xs absolute whitespace-nowrap"
                >
                  {day.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Y axis */}
      <div
        className="absolute right-0 top-0
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            translate-y-[var(--marginTop)]
            w-[var(--marginRight)]
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
                left: "0%",
              }}
              className="absolute text-xs -translate-y-1/2 text-gray-400 w-full text-right pl-1"
            >
              {value}
            </div>
          ))}
      </div>
    </div>
  );
}
