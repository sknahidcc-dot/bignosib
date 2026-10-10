import React from 'react';
import { Crown, Award, Medal, Sparkles, TrendingUp, Users } from 'lucide-react';

interface PrizeDiagramProps {
  totalPool: number;
}

export const PrizeDiagram: React.FC<PrizeDiagramProps> = ({ totalPool }) => {
  const firstPrizeAmount = Math.round(totalPool * 0.15);
  const secondPrizeAmount = Math.round((totalPool * 0.15) / 2);
  const thirdPrizeAmount = Math.round((totalPool * 0.20) / 5);

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-[#0B1120] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Guaranteed 8 Winners Every Draw</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          How Much Will You Win?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Your individual take-home cash prize for every winning category in this active draw.
        </p>
      </div>

      {/* 3 Tier Cards: Clean individual cash payout focus with prominent winner counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
        {/* Tier 1: 1st Prize (1 Winner) */}
        <div className="relative rounded-2xl bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 border-2 border-amber-500/50 p-6 flex flex-col justify-between shadow-lg shadow-amber-500/5 group hover:border-amber-400 transition-all">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[11px] rounded-full uppercase tracking-wider shadow">
            Top Jackpot • 1 Winner
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Crown className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-bold text-xs border border-amber-500/30 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                1 Winner
              </span>
            </div>

            <h4 className="text-lg font-bold text-white mb-1">1st Prize</h4>
            <div className="text-xs text-slate-400 mb-4">
              Single lucky winner receives entire top prize
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 mb-2">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Winner Receives:</div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tabular-nums mt-1">
                ৳{firstPrizeAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-xs text-amber-300/90 font-medium pt-3 border-t border-slate-800/80">
            1 Person gets this exact cash payout
          </div>
        </div>

        {/* Tier 2: 2nd Prize (2 Winners) */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-800/60 via-slate-900 to-slate-950 border border-slate-700/80 p-6 flex flex-col justify-between hover:border-slate-600 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700">
                <Award className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                2 Winners
              </span>
            </div>

            <h4 className="text-lg font-bold text-white mb-1">2nd Prize</h4>
            <div className="text-xs text-slate-400 mb-4">
              2 individual winners (Each receives this amount)
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-2">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Each Winner Receives:</div>
              <div className="text-3xl sm:text-4xl font-black text-slate-100 font-mono tabular-nums mt-1">
                ৳{secondPrizeAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-300 font-medium pt-3 border-t border-slate-800/80">
            2 Persons get ৳{secondPrizeAmount.toLocaleString()} each
          </div>
        </div>

        {/* Tier 3: 3rd Prize (5 Winners) */}
        <div className="rounded-2xl bg-gradient-to-b from-amber-900/10 via-slate-900 to-slate-950 border border-slate-700/80 p-6 flex flex-col justify-between hover:border-slate-600 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-900/20 text-amber-500 flex items-center justify-center border border-amber-800/30">
                <Medal className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                5 Winners
              </span>
            </div>

            <h4 className="text-lg font-bold text-white mb-1">3rd Prize</h4>
            <div className="text-xs text-slate-400 mb-4">
              5 individual winners (Each receives this amount)
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-2">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Each Winner Receives:</div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tabular-nums mt-1">
                ৳{thirdPrizeAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-xs text-emerald-400/90 font-medium pt-3 border-t border-slate-800/80">
            5 Persons get ৳{thirdPrizeAmount.toLocaleString()} each
          </div>
        </div>
      </div>

      {/* Footer info strip */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Ticket price ৳50 • Total 8 winners chosen every draw (1 in 1st, 2 in 2nd, 5 in 3rd).</span>
        </div>
        <div className="text-slate-400">
          Total Prize Pool: <span className="text-amber-400 font-bold font-mono">৳{(firstPrizeAmount + secondPrizeAmount * 2 + thirdPrizeAmount * 5).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
