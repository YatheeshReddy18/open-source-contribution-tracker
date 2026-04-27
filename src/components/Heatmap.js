import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import API from "../services/api";
import { format } from "date-fns";

function Heatmap({ username, theme }) {
  const [data, setData] = useState([]);
  const isDark = theme === "dark";

  useEffect(() => {
    API.get(`/api/github/events/${username}`)
      .then(res => {
        const counts = {};

        if (Array.isArray(res.data)) {
          res.data.forEach(event => {
            if (event.created_at) {
              const date = format(new Date(event.created_at), "yyyy-MM-dd");
              counts[date] = (counts[date] || 0) + 1;
            }
          });
        }

        const result = Object.keys(counts).map(date => ({
          date,
          count: counts[date]
        }));

        setData(result);
      })
      .catch(err => {
        console.error("Error fetching heatmap events:", err);
        setData([]);
      });
  }, [username]);

  return (
    <div>
      <h2>🔥 Heatmap</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().setMonth(new Date().getMonth() - 3))}
        endDate={new Date()}
        values={data}
        classForValue={(value) => {
          if (!value) {
            return isDark ? 'color-empty-dark' : 'color-empty';
          }
          return isDark ? `color-scale-dark-${value.count}` : `color-scale-${value.count}`;
        }}
      />
      <style>{`
        .color-empty { fill: #ebedf0; }
        .color-scale-1 { fill: #9be9a8; }
        .color-scale-2 { fill: #40c463; }
        .color-scale-3 { fill: #30a14e; }
        .color-scale-4 { fill: #216e39; }

        .color-empty-dark { fill: #161b22; }
        .color-scale-dark-1 { fill: #0e4429; }
        .color-scale-dark-2 { fill: #006d32; }
        .color-scale-dark-3 { fill: #26a641; }
        .color-scale-dark-4 { fill: #39d353; }
        
        .react-calendar-heatmap text {
          fill: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

export default Heatmap;