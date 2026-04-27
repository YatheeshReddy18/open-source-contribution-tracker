import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";

function Charts({ repos, events, theme }) {
  // Top 10 repos by stars
  const starData = repos
    .map(repo => ({
      name: repo.name,
      stars: repo.stargazers_count
    }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10);

  const languageCount = {};
  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  const languageData = Object.keys(languageCount).map(lang => ({
    name: lang,
    value: languageCount[lang]
  })).sort((a, b) => b.value - a.value);

  // Activity Breakdown
  const activityCount = {};
  if (events) {
    events.forEach(event => {
      let type = "Other";
      if (event.type === "PushEvent") type = "Commits";
      else if (event.type === "PullRequestEvent") type = "Pull Requests";
      else if (event.type === "IssuesEvent") type = "Issues";
      else if (event.type === "WatchEvent") type = "Stars";
      
      activityCount[type] = (activityCount[type] || 0) + 1;
    });
  }

  const activityData = Object.keys(activityCount).map(type => ({
    name: type,
    value: activityCount[type]
  })).sort((a, b) => b.value - a.value);

  // Black and White Theme Colors
  const isDark = theme === "dark";
  const axisColor = isDark ? "#A1A1AA" : "#52525B";
  const gridColor = isDark ? "#3F3F46" : "#E4E4E7";
  const tooltipBg = isDark ? "#18181B" : "#FFFFFF";
  const tooltipColor = isDark ? "#FFFFFF" : "#000000";

  // Monochromatic palettes
  const barColor = isDark ? "#FFFFFF" : "#000000";
  const PIE_COLORS = isDark 
    ? ["#FFFFFF", "#D4D4D8", "#A1A1AA", "#71717A", "#52525B"] 
    : ["#000000", "#3F3F46", "#52525B", "#71717A", "#A1A1AA"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: tooltipBg, color: tooltipColor, padding: '10px', border: `1px solid ${gridColor}`, borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{label || payload[0].name}</p>
          <p style={{ margin: 0 }}>{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', width: '100%' }}>
      <div style={{ flex: '1 1 500px', minWidth: 0 }}>
        <h2 className="section-title">⭐ Top 10 Repositories by Stars</h2>
        <div style={{ height: 350, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={starData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={axisColor} angle={-45} textAnchor="end" tick={{ fontSize: 12 }} />
              <YAxis stroke={axisColor} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#27272A' : '#F4F4F5' }} />
              <Bar dataKey="stars" fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
        <h2 className="section-title">⚡ Activity Breakdown</h2>
        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={activityData} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: tooltipColor }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
        <h2 className="section-title">💻 Language Distribution</h2>
        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={languageData} dataKey="value" outerRadius={100} paddingAngle={1}>
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: tooltipColor }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;