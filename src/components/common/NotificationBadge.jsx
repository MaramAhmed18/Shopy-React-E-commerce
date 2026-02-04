import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

export default function NotificationBadge({ message, type = "info", duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: CheckCircle,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: XCircle,
      color: "text-red-600",
      iconBg: "bg-red-100"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: AlertCircle,
      color: "text-amber-600",
      iconBg: "bg-amber-100"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Info,
      color: "text-blue-600",
      iconBg: "bg-blue-100"
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`fixed top-22 right-6 ${config.bg} border-2 ${config.border} rounded-2xl p-4 shadow-lg flex items-center gap-3 z-50 max-w-sm animate-in slide-in-from-top-4 duration-300`}>
      <div className={`${config.iconBg} p-2 rounded-lg flex-shrink-0`}>
        <Icon className={`${config.color} w-5 h-5`} />
      </div>
      <p className={`${config.color} font-bold text-sm flex-1`}>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className={`${config.color} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
