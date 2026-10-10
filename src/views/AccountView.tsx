import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  User,
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Camera,
  Save,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Sparkles,
  Gift,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Ticket, TicketOrder, UserProfile, DrawWinner } from '../types/lottery';
import { AuthService } from '../lib/auth';
import { LotteryStore } from '../lib/store';
import { TicketCard } from '../components/TicketCard';

interface AccountViewProps {
  currentUser: UserProfile;
  userOrders: TicketOrder[];
  userTickets: Ticket[];
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onNavigate: (view: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  userOrders,
  userTickets,
  onProfileUpdated,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'orders' | 'profile'>('tickets');

  // Profile Edit State
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [country, setCountry] = useState(currentUser.country || 'Bangladesh');
  const [address, setAddress] = useState(currentUser.address);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || '');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tickets Wallet Search & Pagination (supports smooth handling of 2000+ tickets)
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(12);

  // Avatar upload handler (Max 200KB)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      setProfileMessage({
        type: 'error',
        text: 'Selected image exceeds the 200KB limit. Please choose a smaller photo under 200KB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      setProfileMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const res = AuthService.updateProfile(currentUser.id, {
      full_name: fullName,
      email,
      phone,
      country,
      address,
      avatar_url: avatarUrl,
    });

    setSavingProfile(false);
    if (res.success && res.user) {
      setProfileMessage({ type: 'success', text: 'Profile successfully updated!' });
      onProfileUpdated(res.user);
    } else {
      setProfileMessage({ type: 'error', text: res.message });
    }
  };

  const countries = [
    'Bangladesh',
    'United Arab Emirates',
    'Saudi Arabia',
    'Malaysia',
    'Singapore',
    'Qatar',
    'Oman',
    'United Kingdom',
    'United States',
    'Canada',
    'Other',
  ];

  const pendingOrders = userOrders.filter(o => o.status === 'pending');
  const approvedOrders = userOrders.filter(o => o.status === 'approved');

  // Tickets sub-filter: 'all' | 'live' | 'expired'
  const [ticketFilter, setTicketFilter] = useState<'all' | 'live' | 'expired'>('all');

  // Pending winning tickets that have NOT yet been marked paid by admin
  const pendingWinningTickets = useMemo(() => {
    const list = [...userTickets.filter(t => t.is_winner && t.payout_status !== 'paid')];
    // Also cross-reference with LotteryStore.getWinners() to guarantee winner recognition
    const allWinners = LotteryStore.getWinners();
    const userUnpaidWinners = allWinners.filter((w: DrawWinner) => {
      if (w.payout_status === 'paid') return false;
      if (w.user_id === currentUser.id) return true;
      if (userTickets.some(ut => ut.ticket_number === w.ticket_number)) return true;
      if (currentUser.phone && w.masked_phone) {
        const cleanUser = currentUser.phone.replace(/\D/g, '');
        const cleanMask = w.masked_phone.replace(/\D/g, '');
        if (cleanUser.length >= 5 && cleanMask.length >= 5 && cleanUser.startsWith(cleanMask.slice(0, 5))) {
          return true;
        }
      }
      return false;
    });

    userUnpaidWinners.forEach((w: DrawWinner) => {
      if (!list.some(t => t.ticket_number === w.ticket_number)) {
        list.push({
          id: w.ticket_id || `win-tkt-${w.id}`,
          ticket_number: w.ticket_number,
          order_id: '',
          user_id: currentUser.id,
          draw_id: w.draw_id,
          is_winner: true,
          prize_tier: w.prize_tier,
          prize_amount: w.prize_amount,
          payout_status: 'pending',
          status: 'expired',
          created_at: w.announced_at,
          buyer_name: currentUser.full_name,
          buyer_phone: currentUser.phone,
        });
      }
    });

    return list;
  }, [userTickets, currentUser]);

  const totalUnpaidPrizeAmount = useMemo(() => {
    return pendingWinningTickets.reduce((sum, t) => sum + (t.prize_amount || 0), 0);
  }, [pendingWinningTickets]);

  // Live vs Expired separation
  const liveTickets = useMemo(() => {
    return userTickets.filter(t => t.status === 'valid');
  }, [userTickets]);

  const expiredTickets = useMemo(() => {
    return userTickets.filter(t => t.status === 'expired');
  }, [userTickets]);

  // Trigger celebratory confetti if user has won an unpaid prize
  useEffect(() => {
    if (pendingWinningTickets.length > 0) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#F59E0B', '#10B981', '#F43F5E', '#3B82F6', '#FBBF24'],
      });
    }
  }, [pendingWinningTickets.length]);

  // Tickets memoized pagination & search
  const filteredTickets = useMemo(() => {
    let list = userTickets;
    if (ticketFilter === 'live') {
      list = liveTickets;
    } else if (ticketFilter === 'expired') {
      list = expiredTickets;
    }

    if (!ticketSearch.trim()) return list;
    const q = ticketSearch.trim().toLowerCase();
    return list.filter(t => t.ticket_number.toLowerCase().includes(q));
  }, [userTickets, liveTickets, expiredTickets, ticketFilter, ticketSearch]);

  const totalTicketPages = Math.max(1, Math.ceil(filteredTickets.length / ticketsPerPage));
  const safeTicketPage = Math.min(ticketPage, totalTicketPages);
  const currentPagedTickets = useMemo(() => {
    const start = (safeTicketPage - 1) * ticketsPerPage;
    return filteredTickets.slice(start, start + ticketsPerPage);
  }, [filteredTickets, safeTicketPage, ticketsPerPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner / User Brief */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1020] to-slate-900 border border-slate-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={currentUser.full_name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-2xl font-display">
              {currentUser.full_name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              {currentUser.full_name}
            </h1>
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
              <span className="font-mono text-emerald-400">@{currentUser.username}</span>
              <span>·</span>
              <span>{currentUser.phone}</span>
              <span>·</span>
              <span>{currentUser.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('lottery-buy')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <TicketIcon className="w-4 h-4" />
            <span>Buy More Tickets (৳50)</span>
          </button>
        </div>
      </div>

      {/* 🏆 WINNER CELEBRATION & PENDING PAYOUT BANNER */}
      {pendingWinningTickets.length > 0 && (
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#181E15] to-emerald-950/70 border-2 border-amber-400/90 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
                <Trophy className="w-4 h-4 text-slate-950 fill-current" />
                <span>Winner Notification · আপনি বিজয়ী হয়েছেন!</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2.5">
                  <span>🎉 Congratulations, {currentUser.full_name}!</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  অভিনন্দন! BigNosib লটারিতে আপনার টিকিট পুরষ্কার জিতেছে। যতদিন না আপনি টাকা পাচ্ছেন ততদিন এই বার্তাটি আপনার প্রোফাইলে প্রদর্শিত থাকবে। এডমিন পেমেন্ট পরিশোধ করে দিলে এটি সম্পন্ন হয়ে চলে যাবে।
                </p>
              </div>

              {/* Winning ticket chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {pendingWinningTickets.map((t) => (
                  <div
                    key={t.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400/60 flex items-center gap-2 text-xs shadow"
                  >
                    <span className="font-mono font-bold text-amber-300">{t.ticket_number}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-white font-semibold">{t.prize_tier} Prize</span>
                    <span className="font-mono font-bold text-emerald-400">৳{t.prize_amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total prize badge & payout status */}
            <div className="w-full md:w-auto p-5 rounded-2xl bg-slate-900/90 border border-amber-400/50 text-center space-y-2 shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Total Unclaimed Prize
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                ৳{totalUnpaidPrizeAmount.toLocaleString()}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  Payout Status: Pending Disbursement
                </span>
                <p className="text-[10px] text-slate-400 mt-1.5 max-w-[260px]">
                  এডমিন আপনার মোবাইল নম্বরে ({currentUser.phone}) টাকা পাঠিয়ে দিলে এটি চলে যাবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tickets'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TicketIcon className="w-4 h-4" />
          <span>My Tickets ({userTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Order History ({userOrders.length})</span>
          {pendingOrders.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: TICKETS WALLET & DOWNLOAD */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Approved Draw Tickets
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                লাইভ টিকিটগুলো চলতি ড্র-তে বৈধ এবং মেয়াদোত্তীর্ণ টিকিটগুলো লাল রঙে আলাদা প্রদর্শিত।
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                🟢 Live Active: {liveTickets.length}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
                🔴 Expired: {expiredTickets.length}
              </span>
            </div>
          </div>

          {userTickets.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <TicketIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Tickets Issued Yet</h3>
              <p className="text-xs text-slate-400">
                You haven&apos;t purchased any tickets or your submitted orders are currently awaiting manual admin approval.
              </p>
              <button
                onClick={() => onNavigate('lottery-buy')}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors"
              >
                Purchase Your First Ticket (৳50)
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      setTicketFilter('all');
                      setTicketPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      ticketFilter === 'all'
                        ? 'bg-slate-800 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Tickets ({userTickets.length})
                  </button>

                  <button
                    onClick={() => {
                      setTicketFilter('live');
                      setTicketPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      ticketFilter === 'live'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Live Only ({liveTickets.length})
                  </button>

                  <button
                    onClick={() => {
                      setTicketFilter('expired');
                      setTicketPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      ticketFilter === 'expired'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Expired ({expiredTickets.length})
                  </button>
                </div>

                {/* Search Bar & Per Page */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ticketSearch}
                      onChange={(e) => {
                        setTicketSearch(e.target.value);
                        setTicketPage(1);
                      }}
                      placeholder="Search ticket # (BN-2026)..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                    <span className="text-[11px] text-slate-500">Per page:</span>
                    <select
                      value={ticketsPerPage}
                      onChange={(e) => {
                        setTicketsPerPage(Number(e.target.value));
                        setTicketPage(1);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notice banner when viewing Expired tickets */}
              {ticketFilter === 'expired' && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    মেয়াদোত্তীর্ণ টিকিট: এই টিকিটগুলোর ড্র অনুষ্ঠিত হয়ে গেছে। এগুলো লাল বর্ডার ও হালকা ব্লার ডিজাইনে সংরক্ষিত।
                  </span>
                </div>
              )}

              {/* Tickets Grid */}
              {currentPagedTickets.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                  <p>No tickets match your search or filter.</p>
                  {ticketFilter === 'live' && liveTickets.length === 0 && (
                    <button
                      onClick={() => onNavigate('lottery-buy')}
                      className="mt-2 px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Buy Ticket for Current Draw (৳50)
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPagedTickets.map((tkt) => (
                    <TicketCard key={tkt.id} ticket={tkt} />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalTicketPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => setTicketPage((p) => Math.max(1, p - 1))}
                    disabled={safeTicketPage === 1}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>

                  <div className="text-xs font-mono text-slate-400">
                    Page <span className="text-white font-bold">{safeTicketPage}</span> of{' '}
                    <span className="text-white font-bold">{totalTicketPages}</span> (Showing{' '}
                    {filteredTickets.length > 0 ? (safeTicketPage - 1) * ticketsPerPage + 1 : 0}-
                    {Math.min(safeTicketPage * ticketsPerPage, filteredTickets.length)} of {filteredTickets.length})
                  </div>

                  <button
                    onClick={() => setTicketPage((p) => Math.min(totalTicketPages, p + 1))}
                    disabled={safeTicketPage === totalTicketPages}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDER HISTORY & STATUS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display">
              Payment Submissions & Approvals
            </h2>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
              <p className="text-xs text-slate-400">No payment orders placed yet.</p>
              <button
                onClick={() => onNavigate('lottery-buy')}
                className="px-5 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Buy Tickets Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white uppercase">
                        TrxID: {order.transaction_id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-mono text-slate-300">
                        {order.payment_method}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Quantity: <span className="text-white font-semibold">{order.quantity}</span> ticket(s) · Paid: <span className="text-emerald-400 font-mono font-bold">৳{order.total_amount}</span> · Sender: <span className="font-mono text-slate-300">{order.sender_number}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Submitted on: {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    {order.status === 'pending' && (
                      <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Pending Admin Review
                      </span>
                    )}
                    {order.status === 'approved' && (
                      <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved & Enrolled
                      </span>
                    )}
                    {order.status === 'rejected' && (
                      <div className="text-right">
                        <span className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          Payment Rejected
                        </span>
                        {order.rejection_reason && (
                          <div className="text-[11px] text-rose-400 mt-1 max-w-xs">
                            Reason: {order.rejection_reason}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
              Personal Information & Profile Photo
            </h2>

            {/* Profile Avatar Upload (Max 200KB) */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile Avatar"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-2xl border border-slate-700">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-emerald-400"
                  title="Upload photo (< 200KB)"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Upload New Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="text-[11px] text-slate-500">
                  Maximum file size: 200KB (JPG, PNG, or WEBP).
                </div>
              </div>
            </div>

            {/* Feedback alert */}
            {profileMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileMessage.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name* */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Username (Unique, readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Username (Unique)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.username}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 font-mono text-xs cursor-not-allowed"
                />
              </div>

              {/* Email* */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Phone* */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Country Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address* (Textarea) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Delivery / Residential Address *
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Area, City, Postal Code"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
