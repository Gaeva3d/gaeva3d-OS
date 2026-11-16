/**
 * SummaryCard - Display a single summary statistic
 *
 * Used in the Command Center to show aggregate counts.
 */
import { Link } from 'react-router-dom';

/**
 * Color variants for different stat types
 */
const variants = {
  default: {
    bg: 'bg-gray-800',
    text: 'text-gray-400',
    value: 'text-white'
  },
  success: {
    bg: 'bg-emerald-900/30',
    text: 'text-emerald-400',
    value: 'text-emerald-300'
  },
  warning: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-400',
    value: 'text-amber-300'
  },
  danger: {
    bg: 'bg-red-900/30',
    text: 'text-red-400',
    value: 'text-red-300'
  },
  info: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-400',
    value: 'text-blue-300'
  }
};

export default function SummaryCard({
  label,
  value,
  subtitle,
  variant = 'default',
  href,
  onClick
}) {
  const colors = variants[variant] || variants.default;

  const content = (
    <div
      className={`
        ${colors.bg} rounded-xl p-4 border border-gray-700
        ${(href || onClick) ? 'hover:border-gray-500 cursor-pointer transition-colors' : ''}
      `}
      onClick={onClick}
    >
      <div className={`text-sm font-medium ${colors.text}`}>
        {label}
      </div>
      <div className={`text-3xl font-bold mt-1 ${colors.value}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}
