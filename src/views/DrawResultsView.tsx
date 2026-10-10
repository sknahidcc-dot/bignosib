import React, { useState } from 'react';
import { Trophy, Crown, Award, Medal, Clock, Search, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Draw, DrawWinner, Ticket } from '../types/lottery';
import { CountdownTimer } from '../components/CountdownTimer';
import { ASSETS } from '../assets/images';

interface DrawResultsViewProps {
  currentDraw: Draw;
  pastDraws: Draw[];
  allWinners: DrawWinner[];
  userTickets: Ticket[];
  onNavigate: (view: string) => void;
}

export const DrawResultsView: React.FC<DrawResultsViewProps> = ({
  currentDraw,
  pastDraws,
  allWinners,
  userTickets,
  onNavigate,
}) => {
  const [selectedDrawId, setSelectedDrawId] = useState<string>(pastDraws[0]?.id || currentDraw.id);
  const [searchTicketNumber, setSearchTicketNumber] = useState('');
  const [searchResult, setSearchResult] = useState<{ checked: boolean; isWinner: boolean; ticket?: any; winner?: DrawWinner } | null>(null);

  const selectedDraw =
    pastDraws.find((d) => d.id === selectedDrawId) ||
    (selectedDrawId === currentDraw.id ? currentDraw : pastDraws[0]);

  const drawWinners = allWinners.filter((w) => w.draw_id === selectedDrawId);

  // Ticket number search checker
  const handleCheckTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = searchTicketNumber.trim().toUpperCase();
    if (!cleanNum) return;

    const matchedWinner = allWinners.find((w) => w.ticket_number.trim().toUpperCase() === cleanNum);
    const matchedUserTicket = userTickets.find((t) => t.ticket_number.trim().toUpperCase() === cleanNum);

    if (matchedWinner) {
      setSearchResult({ checked: true, isWinner: true, winner: matchedWinner, ticket: matchedUserTicket });
    } else {
      setSearchResult({ checked: true, isWinner: false, ticket: matchedUserTicket });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. UPCOMING DRAW COUNTDOWN BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1020] to-slate-900 border border-slate-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-luminosity"
          style={{ backgroundImage: `url(${ASSETS.heroJackpot})` }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Active Draw #{currentDraw.draw_number} in Progress</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
            Official Draw & Winning Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Next live jackpot drawing closes soon. Approved tickets will enter the automated cryptographic winner selection.
          </p>

          <CountdownTimer targetDate={currentDraw.draw_date} />

          <div className="pt-2">
            <button
              onClick={() => onNavigate('lottery-buy')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Get In Before Draw Closes (৳50)
            </button>
          </div>
        </div>
      </div>

      {/* 2. TICKET SEARCH / VERIFICATION TOOL */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto space-y-4">
        <div className="text-center">
          <h2 className="text-base font-bold text-white font-display">
            Check Ticket Winning Status
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your unique ticket number (e.g. <span className="font-mono text-emerald-400">BN-2026-948102</span>) to instantly check for prize matches.
          </p>
        </div>

        <form onSubmit={handleCheckTicket} className="flex gap-2">
          <input
            type="text"
            placeholder="BN-2026-XXXXXX"
            value={searchTicketNumber}
            onChange={(e) => setSearchTicketNumber(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-400 uppercase"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Check</span>
          </button>
        </form>

        {searchResult && searchResult.checked && (
          <div className="pt-2">
            {searchResult.isWinner ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">
                    CONGRATULATIONS! This ticket won {searchResult.winner?.prize_tier} Prize!
                  </div>
                  <div className="text-xs text-emerald-300/90 mt-1 font-mono">
                    Prize Amount: ৳{searchResult.winner?.prize_amount.toLocaleString()} in Draw #{searchResult.winner?.draw_number}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white font-mono">{searchTicketNumber}</span> is not listed as a winning ticket in past archived draws. If this is an active ticket, check back once the countdown finishes!
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. DRAW SELECTOR & WINNERS ARCHIVE */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-white font-display">
              Archived Draw Results
            </h2>
            <p className="text-xs text-slate-400">
              Browse official recorded draws and verified prize payouts.
            </p>
          </div>

          {/* Draw Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Draw:</span>
            <select
              value={selectedDrawId}
              onChange={(e) => setSelectedDrawId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            >
              {pastDraws.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900">
                  Draw #{d.draw_number} ({new Date(d.draw_date).toLocaleDateString()})
                </option>
              ))}
              <option value={currentDraw.id} className="bg-slate-900">
                Draw #{currentDraw.draw_number} (Active / Upcoming)
              </option>
            </select>
          </div>
        </div>

        {/* Selected Draw Summary Header */}
        {selectedDraw && (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Draw Title</div>
              <div className="text-sm font-bold text-white mt-0.5">{selectedDraw.title}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Total Pool</div>
              <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                ৳{selectedDraw.total_pool_amount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Tickets Sold</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {selectedDraw.total_tickets_sold}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Draw Status</div>
              <div className="text-sm font-bold mt-0.5">
                {selectedDraw.status === 'completed' ? (
                  <span className="text-emerald-400">Completed & Verified</span>
                ) : (
                  <span className="text-amber-400">Scheduled / Active</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selected Draw Winners Roster Grouped by Tier */}
        {selectedDraw?.status === 'completed' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Official Winners Roster — Draw #{selectedDraw.draw_number}</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Total 8 Winners Announced
              </span>
            </div>

            {drawWinners.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/30 border border-slate-800 text-center text-xs text-slate-400">
                Winners record being synced.
              </div>
            ) : (
              <div className="space-y-8">
                {/* 1st Prize Section (1 Winner) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                      <Crown className="w-4 h-4" />
                      <span>1st Prize (1 Winner)</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Payout: ৳{drawWinners.find(w => w.prize_tier === '1st')?.prize_amount.toLocaleString() || '9,750'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drawWinners
                      .filter((w) => w.prize_tier === '1st')
                      .map((w) => (
                        <div
                          key={w.id}
                          className="p-5 rounded-2xl bg-slate-900/90 border-2 border-amber-500/50 space-y-3 shadow-lg shadow-amber-500/5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              🥇 1st Prize Winner
                            </span>
                            <span className="text-base font-black text-emerald-400 font-mono tabular-nums">
                              ৳{w.prize_amount.toLocaleString()}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30">
                            <div className="text-[10px] text-slate-400 font-mono uppercase">Ticket Number</div>
                            <div className="text-lg font-black text-amber-400 font-mono tracking-wider">
                              {w.ticket_number}
                            </div>
                          </div>

                          <div className="text-xs text-slate-300 space-y-0.5">
                            <div className="font-bold text-white text-sm">{w.full_name}</div>
                            <div className="font-mono text-[11px] text-slate-400">
                              Phone: {w.masked_phone} · Email: {w.masked_email}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 2nd Prize Section (2 Winners) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Award className="w-4 h-4 text-slate-300" />
                      <span>2nd Prize (2 Winners — Each Receives)</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Payout: ৳{drawWinners.find(w => w.prize_tier === '2nd')?.prize_amount.toLocaleString() || '4,875'} each
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {drawWinners
                      .filter((w) => w.prize_tier === '2nd')
                      .map((w, idx) => (
                        <div
                          key={w.id}
                          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase font-mono bg-slate-800 text-slate-200 border border-slate-700">
                              🥈 2nd Prize • Winner #{idx + 1}
                            </span>
                            <span className="text-base font-black text-emerald-400 font-mono tabular-nums">
                              ৳{w.prize_amount.toLocaleString()}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-[10px] text-slate-400 font-mono uppercase">Ticket Number</div>
                            <div className="text-lg font-black text-slate-100 font-mono tracking-wider">
                              {w.ticket_number}
                            </div>
                          </div>

                          <div className="text-xs text-slate-300 space-y-0.5">
                            <div className="font-bold text-white text-sm">{w.full_name}</div>
                            <div className="font-mono text-[11px] text-slate-400">
                              Phone: {w.masked_phone} · Email: {w.masked_email}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 3rd Prize Section (5 Winners) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-500">
                      <Medal className="w-4 h-4 text-amber-500" />
                      <span>3rd Prize (5 Winners — Each Receives)</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Payout: ৳{drawWinners.find(w => w.prize_tier === '3rd')?.prize_amount.toLocaleString() || '2,600'} each
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drawWinners
                      .filter((w) => w.prize_tier === '3rd')
                      .map((w, idx) => (
                        <div
                          key={w.id}
                          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase font-mono bg-amber-950/40 text-amber-400 border border-amber-900/40">
                              🥉 3rd Prize • Winner #{idx + 1}
                            </span>
                            <span className="text-sm font-black text-emerald-400 font-mono tabular-nums">
                              ৳{w.prize_amount.toLocaleString()}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                            <div className="text-[10px] text-slate-400 font-mono uppercase">Ticket Number</div>
                            <div className="text-base font-black text-amber-400/90 font-mono tracking-wider">
                              {w.ticket_number}
                            </div>
                          </div>

                          <div className="text-xs text-slate-300 space-y-0.5">
                            <div className="font-bold text-white">{w.full_name}</div>
                            <div className="font-mono text-[11px] text-slate-400">
                              Phone: {w.masked_phone} · Email: {w.masked_email}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-slate-900/30 border border-slate-800 text-center space-y-3">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">This Draw Has Not Concluded Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Draw #{currentDraw.draw_number} is actively accepting participants. Results will publish automatically once the countdown finishes and the draw is executed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
