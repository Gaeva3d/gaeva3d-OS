import { Link } from "react-router-dom";

export default function ProductionPipeline({ stats }) {
  const stages = [
    { key: "draft", label: "Draft", count: stats?.production?.draft || 0, color: "bg-gray-500" },
    { key: "released", label: "Released", count: stats?.production?.released || 0, color: "bg-blue-500" },
    { key: "scheduled", label: "Scheduled", count: stats?.production?.scheduled || 0, color: "bg-cyan-500" },
    { key: "in_progress", label: "In Progress", count: stats?.production?.in_progress || 0, color: "bg-purple-500" },
    { key: "complete", label: "Complete", count: stats?.production?.complete_today || 0, color: "bg-green-500" },
  ];

  const total = stages.reduce((sum, s) => sum + s.count, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex h-4 rounded-full overflow-hidden bg-gray-800">
        {stages.map((stage) => (
          stage.count > 0 && (
            <Link
              key={stage.key}
              to={`/admin/production?status=${stage.key}`}
              className={`${stage.color} hover:opacity-80 transition-opacity`}
              style={{ width: `${(stage.count / total) * 100}%` }}
              title={`${stage.label}: ${stage.count}`}
            />
          )
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        {stages.map((stage) => (
          <Link
            key={stage.key}
            to={`/admin/production?status=${stage.key}`}
            className="flex items-center gap-1.5 hover:opacity-80"
          >
            <span className={`w-2 h-2 rounded-full ${stage.color}`}></span>
            <span className="text-gray-400">{stage.label}:</span>
            <span className="text-white font-medium">{stage.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
