import React from 'react';
import { Ticket, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Trophy, Clock, Zap } from 'lucide-react';
import { Draw, DrawWinner } from '../types/lottery';
import { CountdownTimer } from '../components/CountdownTimer';
import { PrizeDiagram } from '../components/PrizeDiagram';
import { ASSETS } from '../assets/images';

interface HomeViewProps {
  currentDraw: Draw;
  winners: DrawWinner[];
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentDraw,
  winners,
  onNavigate,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-[#0B1020] to-[#070B14] p-6 sm:p-12 lg:p-16">
          {/* Hero background image with measured scrim overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
            style={{ backgroundImage: `url(${ASSETS.heroJackpot})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Official Bangladesh Digital Lottery • Draw #{currentDraw.draw_number}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.1] text-balance">
              Win Big Every Week With <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">BigNosib</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Experience the country&apos;s most transparent digital lottery. Pay ৳50 via bKash, Nagad, or USDT, receive your verifiable digital ticket, and participate in our weekly automated jackpot draw.
            </p>

            {/* Countdown Box */}
            <div className="pt-2 pb-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-3 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Next Draw Countdown Closes In:</span>
              </div>
              <CountdownTimer targetDate={currentDraw.draw_date} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('lottery-buy')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 group text-sm"
              >
                <Ticket className="w-5 h-5" />
                <span>Buy Lottery Ticket (৳50)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('draw-results')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Past Draw Results</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Ticket Price</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums mt-1">
              ৳50 <span className="text-xs text-slate-500 font-normal">BDT</span>
            </span>
            <span className="text-[11px] text-emerald-400 mt-1">bKash, Nagad, USDT</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Active Pool</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums mt-1">
              ৳{currentDraw.total_pool_amount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Expands with each ticket</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Tickets In Draw</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums mt-1">
              {currentDraw.total_tickets_sold.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">100% Unique numbers</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Winners Per Draw</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums mt-1">
              8 Winners
            </span>
            <span className="text-[11px] text-amber-400 mt-1">1st, 2nd & 3rd Tiers</span>
          </div>
        </div>
      </section>

      {/* 2. GUARANTEED PRIZE DIAGRAM */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PrizeDiagram totalPool={currentDraw.total_pool_amount} />
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            How BigNosib Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Participating is simple, safe, and fully verified by human auditors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-3 relative group hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black font-mono text-base border border-amber-500/20">
              01
            </div>
            <h3 className="text-base font-bold text-white">Select Tickets</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose how many ৳50 lottery tickets you want. Each ticket multiplies your probability of hitting the jackpot.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-3 relative group hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black font-mono text-base border border-emerald-500/20">
              02
            </div>
            <h3 className="text-base font-bold text-white">Send Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send the exact amount to our official bKash, Nagad, or USDT address and copy the transaction ID (TrxID).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-3 relative group hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black font-mono text-base border border-blue-500/20">
              03
            </div>
            <h3 className="text-base font-bold text-white">Admin Approval</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our administrative security gate checks the TrxID. Once approved, unique ticket numbers are generated instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-3 relative group hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black font-mono text-base border border-purple-500/20">
              04
            </div>
            <h3 className="text-base font-bold text-white">Live Draw & Win</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch the countdown timer hit zero. 8 lucky winners receive their cash prizes transferred directly to their account.
            </p>
          </div>
        </div>
      </section>

      {/* 4. RECENT VERIFIED WINNERS WALL */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#090E17] to-[#070B14] border border-slate-800 p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Verified Draw Hall of Fame</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                Recent Winners Roster
              </h2>
            </div>
            <button
              onClick={() => onNavigate('draw-results')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>See Complete Draw History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {winners.slice(0, 6).map((winner) => (
              <div
                key={winner.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      winner.prize_tier === '1st'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : winner.prize_tier === '2nd'
                        ? 'bg-slate-700/60 text-slate-200 border border-slate-600'
                        : 'bg-amber-900/20 text-amber-500 border border-amber-800/40'
                    }`}
                  >
                    {winner.prize_tier}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{winner.full_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {winner.masked_phone} · {winner.masked_email}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400 font-mono tabular-nums">
                    ৳{winner.prize_amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {winner.ticket_number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECURITY & INTEGRITY CALLOUT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Security Guarantee</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Zero Duplicate Transaction Policy & Strict Anti-Tampering
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every bKash, Nagad, and USDT transaction is checked against historical records. Duplicate Txn IDs are automatically blocked. Only verified payments yield official ticket numbers entered into the active draw.
            </p>
          </div>
          <button
            onClick={() => onNavigate('lottery-buy')}
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            Enter Today&apos;s Draw (৳50)
          </button>
        </div>
      </section>
    </div>
  );
};
