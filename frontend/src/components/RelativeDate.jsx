import { useState, useEffect } from "react";

/**
 * RelativeDate - Displays dates in human-readable relative format
 *
 * Shows "2 hours ago", "Yesterday", "3 days ago", etc.
 * Falls back to absolute date for older dates.
 * Updates automatically every minute for recent dates.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;
const TIMELINE_LOCALE = "pt-BR";
const relative = new Intl.RelativeTimeFormat(TIMELINE_LOCALE, { numeric: "always" });

function formatRelative(date) {
  const now = new Date();
  const then = new Date(date);

  // Validate date before formatting
  if (isNaN(then.getTime())) {
    return "";
  }

  const diff = now - then;

  // Future dates
  if (diff < 0) {
    const absDiff = Math.abs(diff);
    if (absDiff < MINUTE) return "Em instantes";
    if (absDiff < HOUR) {
      const mins = Math.round(absDiff / MINUTE);
      return relative.format(mins, "minute");
    }
    if (absDiff < DAY) {
      const hours = Math.round(absDiff / HOUR);
      return relative.format(hours, "hour");
    }
    if (absDiff < WEEK) {
      const days = Math.round(absDiff / DAY);
      return relative.format(days, "day");
    }
    // For far future, show absolute date
    return then.toLocaleDateString(TIMELINE_LOCALE);
  }

  // Past dates
  if (diff < MINUTE) return "Agora";
  if (diff < HOUR) {
    const mins = Math.round(diff / MINUTE);
    return relative.format(-mins, "minute");
  }
  if (diff < DAY) {
    const hours = Math.round(diff / HOUR);
    return relative.format(-hours, "hour");
  }
  if (diff < 2 * DAY) return "Ontem";
  if (diff < WEEK) {
    const days = Math.round(diff / DAY);
    return relative.format(-days, "day");
  }
  if (diff < MONTH) {
    const weeks = Math.round(diff / WEEK);
    return relative.format(-weeks, "week");
  }
  if (diff < YEAR) {
    const months = Math.round(diff / MONTH);
    return relative.format(-months, "month");
  }

  // Over a year - show date
  return then.toLocaleDateString(TIMELINE_LOCALE);
}

function formatAbsolute(date, options = {}) {
  const then = new Date(date);

  // Validate date before formatting
  if (isNaN(then.getTime())) {
    return "";
  }

  const { includeTime = true, short = false } = options;

  if (short) {
    return then.toLocaleDateString(TIMELINE_LOCALE, {
      month: "short",
      day: "numeric",
    });
  }

  if (includeTime) {
    return then.toLocaleString(TIMELINE_LOCALE, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return then.toLocaleDateString(TIMELINE_LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RelativeDate({
  date,
  className = "",
  showAbsolute = false, // Always show absolute date instead of relative
  showTooltip = true, // Show absolute date on hover
  includeTime = true, // Include time in tooltip/absolute display
  updateInterval = 60000, // Update interval in ms (0 to disable)
}) {
  const [, setTick] = useState(0);

  // Auto-update for recent dates
  useEffect(() => {
    if (updateInterval <= 0 || showAbsolute) return;

    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval, showAbsolute]);

  if (!date) {
    return <span className={`text-gray-500 ${className}`}>—</span>;
  }

  const relativeText = formatRelative(date);
  const absoluteText = formatAbsolute(date, { includeTime });

  if (showAbsolute) {
    return <span className={className}>{absoluteText}</span>;
  }

  if (showTooltip) {
    return (
      <span className={`cursor-default ${className}`} title={absoluteText}>
        {relativeText}
      </span>
    );
  }

  return <span className={className}>{relativeText}</span>;
}

// Export helper functions for custom formatting
// eslint-disable-next-line react-refresh/only-export-components
export { formatRelative, formatAbsolute };
