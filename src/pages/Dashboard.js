import React, { useEffect, useState } from "react";
import API from "../services/api";
import Charts from "../components/Charts";
import Heatmap from "../components/Heatmap";
import ActivityFeed from "../components/ActivityFeed";
import { FaGithub, FaChartBar, FaFire, FaCode, FaStar, FaFolderOpen, FaSignOutAlt, FaSearch, FaSort, FaCog } from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [events, setEvents] = useState([]);

  // Sidebar and Theme state
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, repositories, activity, settings
  const [theme, setTheme] = useState("light"); // light or dark

  useEffect(() => {
    API.get("/api/user")
      .then(res => {
        setUser(res.data);
        if (res.data.githubUsername || res.data.username) {
            const lookupName = res.data.githubUsername || res.data.username;
            return Promise.all([
              API.get(`/api/github/repos/${lookupName}`),
              API.get(`/api/github/events/${lookupName}`)
            ]);
        } else {
            return Promise.all([{ data: [] }, { data: [] }]);
        }
      })
      .then(([reposRes, eventsRes]) => {
        setRepos(Array.isArray(reposRes.data) ? reposRes.data : []);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setRepos([]);
        setEvents([]);
      });
  }, []);

  // Theme effect
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // No theme toggle needed for Apple style

  // 📊 Stats
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  const totalForks = repos.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );

  const totalWatchers = repos.reduce(
    (sum, repo) => sum + repo.watchers_count,
    0
  );

  const languages = [
    ...new Set(repos.map(repo => repo.language).filter(Boolean))
  ];

  // Filtering and sorting logic
  const filteredRepos = repos
    .filter(repo => (repo.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at || b.id) - new Date(a.updated_at || a.id);
    });

  const hasGithub = user?.githubUsername || (user?.username && user?.username !== user?.name);

  return (
    <div className={`dashboard-layout ${theme}`}>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2><FaChartBar style={{ fontSize: "20px" }} /> Tracker</h2>
        <div 
          className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <FaChartBar /> Dashboard
        </div>
        <div 
          className={`nav-item ${activeTab === "repositories" ? "active" : ""}`}
          onClick={() => setActiveTab("repositories")}
        >
          <FaGithub /> Repositories
        </div>
        <div 
          className={`nav-item ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          <FaFire /> Activity
        </div>
        <div 
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <FaCog /> Settings
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* HEADER */}
        {user && (
          <div className="header">
            <div className="user-info">
              {user.avatar && <img src={user.avatar} className="avatar" alt="Avatar" />}
              <h2>Welcome back, {user.name}!</h2>
            </div>
            <button
              className="logout-btn"
              onClick={() => window.open("http://localhost:5000/auth/logout", "_self")}
            >
              <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
            </button>
          </div>
        )}

        {/* GITHUB LINK PROMPT */}
        {!hasGithub && activeTab !== "settings" ? (
           <div className="section" style={{ textAlign: "center", padding: "80px 20px", marginTop: "40px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e5e5ea", boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)" }}>
             <FaGithub style={{ fontSize: "64px", color: "#1d1d1f", marginBottom: "20px" }} />
             <h2 style={{ color: "#1d1d1f", marginBottom: "10px" }}>GitHub Not Connected</h2>
             <p style={{ color: "#86868b", marginBottom: "30px", maxWidth: "400px", margin: "0 auto", lineHeight: "1.6" }}>
               Link your GitHub account to access your repositories, contributions heatmap, and detailed open-source statistics.
             </p>
             <button 
               onClick={() => window.open("http://localhost:5000/auth/github", "_self")}
               style={{
                 background: "#007AFF",
                 color: "white", border: "none", fontSize: "16px", fontWeight: "600",
                 padding: "14px 30px", borderRadius: "10px", cursor: "pointer",
               }}
             >
               Link GitHub Account
             </button>
           </div>
        ) : (
          <>
            {/* TAB RENDERING */}
            {activeTab === "dashboard" && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3><FaFolderOpen /> Repositories</h3>
                    <p>{repos.length}</p>
                  </div>
                  <div className="stat-card">
                    <h3><FaStar /> Stars</h3>
                    <p>{totalStars}</p>
                  </div>
                  <div className="stat-card">
                    <h3><FaCode /> Languages</h3>
                    <p>{languages.length}</p>
                  </div>
                  <div className="stat-card">
                    <h3><FaGithub /> Forks</h3>
                    <p>{totalForks}</p>
                  </div>
                </div>

                <div className="chart-section">
                  <Charts repos={repos} events={events} theme={theme} />
                </div>
              </>
            )}

            {activeTab === "repositories" && (
              <div className="section">
                <h2 className="section-title">Your Repositories</h2>
                <div className="repo-toolbar">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Find a repository..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="sort-box">
                    <FaSort className="sort-icon" />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="updated">Recently Updated</option>
                      <option value="stars">Most Stars</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>

                <div className="repo-grid">
                  {filteredRepos.map(repo => (
                    <div key={repo.id} className="repo-card" onClick={() => window.open(repo.html_url, "_blank")}>
                      <h4>{repo.name}</h4>
                      <div className="repo-meta">
                        <div className="repo-stat">
                          <FaStar color="#fbbf24" /> {repo.stargazers_count}
                        </div>
                        {repo.language && (
                          <div className="repo-language">
                            {repo.language}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <>
                <div className="chart-section" style={{ marginBottom: "20px" }}>
                  <h2 className="section-title">Contributions History</h2>
                  {user && <Heatmap username={user.githubUsername || user.username} theme={theme} />}
                </div>
                <div className="chart-section" style={{ marginBottom: "20px" }}>
                  <h2 className="section-title">Recent Activity</h2>
                  <ActivityFeed events={events} />
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <div className="section">
            <h2 className="section-title">Settings</h2>
            <div className="chart-section" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }} className="theme-text">App Theme Options</h3>
                <p style={{ margin: 0 }} className="theme-subtext">Toggle between Light and Dark (Black & White) mode.</p>
              </div>
              <button 
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="theme-toggle-btn"
              >
                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
