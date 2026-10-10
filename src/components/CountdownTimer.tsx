import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  onFinish?: () => void;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const padZero = (n: number) => n.toString().padStart(2, '0');

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-400">
        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          {timeLeft.isPast
            ? 'DRAW IN PROGRESS'
            : `${timeLeft.days}d ${padZero(timeLeft.hours)}h ${padZero(timeLeft.minutes)}m ${padZero(timeLeft.seconds)}s`}
        </span>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
        <span className="text-amber-400 font-bold text-sm sm:text-base animate-pulse">
          🎯 DRAW TIME REACHED — DRAW IN PROGRESS OR AWAITING RESULTS!
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
        <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
          {padZero(timeLeft.days)}
        </span>
        <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
          Days
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
        <span className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
          {padZero(timeLeft.hours)}
        </span>
        <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
          Hours
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
        <span className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
          {padZero(timeLeft.minutes)}
        </span>
        <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
          Mins
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
        <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
          {padZero(timeLeft.seconds)}
        </span>
        <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
          Secs
        </span>
      </div>
    </div>
  );
};
