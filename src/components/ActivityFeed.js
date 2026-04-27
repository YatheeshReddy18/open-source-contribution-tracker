import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FaCodeBranch, FaExclamationCircle, FaStar, FaCode, FaGithub } from "react-icons/fa";

function ActivityFeed({ events }) {
  if (!events || events.length === 0) {
    return <p style={{ color: "var(--text-secondary)" }}>No recent activity found.</p>;
  }

  const getEventIcon = (type) => {
    switch (type) {
      case "PushEvent":
        return <FaCode color="#007AFF" />;
      case "PullRequestEvent":
        return <FaCodeBranch color="#34C759" />;
      case "IssuesEvent":
        return <FaExclamationCircle color="#FF3B30" />;
      case "WatchEvent":
        return <FaStar color="#FFCC00" />;
      default:
        return <FaGithub color="var(--text-secondary)" />;
    }
  };

  const getEventDescription = (event) => {
    switch (event.type) {
      case "PushEvent":
        return `Pushed ${event.payload.commits?.length || 0} commit(s) to`;
      case "PullRequestEvent":
        return `${event.payload.action === "opened" ? "Opened" : "Closed"} a pull request in`;
      case "IssuesEvent":
        return `${event.payload.action === "opened" ? "Opened" : "Closed"} an issue in`;
      case "WatchEvent":
        return `Starred`;
      case "ForkEvent":
        return `Forked`;
      case "CreateEvent":
        return `Created ${event.payload.ref_type} in`;
      default:
        return `Interacted with`;
    }
  };

  return (
    <div className="activity-feed">
      {events.slice(0, 15).map((event) => (
        <div key={event.id} className="activity-item">
          <div className="activity-icon">
            {getEventIcon(event.type)}
          </div>
          <div className="activity-content">
            <p className="activity-text">
              <span className="activity-desc">{getEventDescription(event)}</span>{" "}
              <a 
                href={`https://github.com/${event.repo.name}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="activity-repo"
              >
                {event.repo.name}
              </a>
            </p>
            <span className="activity-time">
              {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
