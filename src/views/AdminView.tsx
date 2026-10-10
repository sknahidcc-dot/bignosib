import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Settings,
  Trophy,
  RefreshCw,
  LogOut,
  AlertCircle,
  Eye,
  Calendar,
  Filter,
  Save,
  Play,
  Shuffle,
  Users
} from 'lucide-react';
import { Draw, DrawWinner, SystemSettings, TicketOrder } from '../types/lottery';
import { AuthService } from '../lib/auth';
import { LotteryStore } from '../lib/store';

interface AdminViewProps {
  settings: SystemSettings;
  currentDraw: Draw;
  orders: TicketOrder[];
  winners: DrawWinner[];
  onRefreshData: () => void;
  onNavigateHome: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  settings,
  currentDraw,
  orders,
  winners,
  onRefreshData,
  onNavigateHome,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AuthService.isAdminAuthenticated());
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'draw' | 'settings' | 'reports'>('orders');

  // Orders Tab Filter & Search
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Payment could not be verified on mobile gateway statement.');

  // Draw Management State
  const [manualFirst, setManualFirst] = useState('');
  const [manualSecond, setManualSecond] = useState('');
  const [manualThird, setManualThird] = useState('');
  const [drawExecuteLoading, setDrawExecuteLoading] = useState(false);
  const [drawFeedback, setDrawFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings Edit State
  const [formSettings, setFormSettings] = useState<SystemSettings>({ ...settings });
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Time filter for reports
  const [reportTimeFilter, setReportTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    setTimeout(() => {
      const res = AuthService.adminLogin(adminUsername, adminPassword);
      setAuthLoading(false);
      if (res.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(res.message);
      }
    }, 400);
  };

  const handleLogout = () => {
    AuthService.adminLogout();
    setIsAuthenticated(false);
  };

  // Order Approval / Rejection Handlers
  const handleApproveOrder = (orderId: string) => {
    const res = LotteryStore.approveOrder(orderId);
    if (res.success) {
      onRefreshData();
    } else {
      alert(res.message);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectingOrderId) return;
    const res = LotteryStore.rejectOrder(rejectingOrderId, rejectionReason);
    setRejectingOrderId(null);
    if (res.success) {
      onRefreshData();
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    LotteryStore.updateSettings(formSettings);
    setSettingsFeedback('System settings updated successfully.');
    onRefreshData();
    setTimeout(() => setSettingsFeedback(null), 3000);
  };

  // Execute Draw
  const handleExecuteDraw = (mode: 'random' | 'manual') => {
    setDrawFeedback(null);
    setDrawExecuteLoading(true);

    setTimeout(() => {
      let manualParams;
      if (mode === 'manual') {
        manualParams = {
          first: manualFirst.trim() ? [manualFirst.trim().toUpperCase()] : undefined,
          second: manualSecond.trim()
            ? manualSecond.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
            : undefined,
          third: manualThird.trim()
            ? manualThird.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
            : undefined,
        };
      }

      const res = LotteryStore.executeDraw(manualParams);
      setDrawExecuteLoading(false);

      if (res.success) {
        setDrawFeedback({ type: 'success', message: res.message });
        setManualFirst('');
        setManualSecond('');
        setManualThird('');
        onRefreshData();
      } else {
        setDrawFeedback({ type: 'error', message: res.message });
      }
    }, 600);
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' ? true : o.status === orderStatusFilter;
    const q = orderSearchQuery.toLowerCase();
    const matchSearch =
      !q ||
      o.transaction_id.toLowerCase().includes(q) ||
      o.sender_number.toLowerCase().includes(q) ||
      (o.user_name && o.user_name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const financialSummary = LotteryStore.getFinancialSummary();

  // If not authenticated, render secure gatekeeper login
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 sm:my-24 px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#090D1A] border border-amber-500/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 shadow">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              BigNosib Security Gate
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Restricted Gateway: /np/error
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Administrative Username / Email *
              </label>
              <input
                type="text"
                required
                placeholder="sknahid.cc"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Security Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {authLoading ? 'Verifying Credentials...' : 'Authenticate & Enter'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-white font-display flex items-center gap-2">
              <span>BigNosib Control Panel</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                Staff Master
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Authorized session: sknahid.cc@gmail.com
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs flex items-center gap-1.5"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Sync Data</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors text-xs flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Payment Approvals ({pendingCount} Pending)</span>
          {pendingCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('draw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'draw'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Draw Execution & Winners</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financial Reports & 50% Share</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Gateway & Platform Settings</span>
        </button>
      </div>

      {/* 1. ORDERS / PAYMENT CONTROL TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    orderStatusFilter === st
                      ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search TrxID, phone, name..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-900/30 border border-slate-800 text-center text-xs text-slate-400">
              No orders found matching the selected filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black font-mono text-white tracking-wider">
                        TrxID: {order.transaction_id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          order.payment_method === 'bkash'
                            ? 'bg-[#D81A60]/20 text-[#FF4081]'
                            : order.payment_method === 'nagad'
                            ? 'bg-[#ED1C24]/20 text-[#FF5252]'
                            : 'bg-[#26A17B]/20 text-[#26A17B]'
                        }`}
                      >
                        {order.payment_method}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : order.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      User: <span className="font-semibold text-white">{order.user_name || 'N/A'}</span> · Phone: <span className="font-mono text-slate-200">{order.user_phone || 'N/A'}</span> · Sender Account: <span className="font-mono text-amber-400">{order.sender_number}</span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>Quantity: <strong className="text-white font-mono">{order.quantity} ticket(s)</strong></span>
                      <span>·</span>
                      <span>Total: <strong className="text-emerald-400 font-mono font-bold">৳{order.total_amount}</strong></span>
                      <span>·</span>
                      <span className="text-[11px] text-slate-500">{new Date(order.created_at).toLocaleString()}</span>
                    </div>

                    {order.rejection_reason && (
                      <div className="text-xs text-rose-400 font-medium">
                        Rejection reason: {order.rejection_reason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {order.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Mint Tickets</span>
                      </button>
                      <button
                        onClick={() => setRejectingOrderId(order.id)}
                        className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Rejection Modal */}
          {rejectingOrderId && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-4">
                <h3 className="text-base font-bold text-white">Reject Payment Submission</h3>
                <p className="text-xs text-slate-400">
                  Please provide the exact reason why this transaction is being rejected. The user will be notified in their order history.
                </p>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-400"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setRejectingOrderId(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. DRAW EXECUTION TAB */}
      {activeTab === 'draw' && (
        <div className="space-y-6">
          {drawFeedback && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                drawFeedback.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{drawFeedback.message}</span>
            </div>
          )}

          {/* Active Draw Stats */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-slate-500 uppercase">Active Draw</div>
              <div className="text-lg font-bold text-white mt-1">#{currentDraw.draw_number}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase">Approved Tickets</div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                {currentDraw.total_tickets_sold}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase">Total Pool Collected</div>
              <div className="text-lg font-black text-amber-400 font-mono mt-1">
                ৳{currentDraw.total_pool_amount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase">Scheduled Date</div>
              <div className="text-xs font-mono text-slate-300 mt-2">
                {new Date(currentDraw.draw_date).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Draw Execution Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode A: Cryptographic Random Winner Draw */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <Shuffle className="w-4 h-4" />
                <span>Mode 1: Cryptographic Random Draw</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uses pseudo-random selection to choose 1 ticket for 1st Prize (15%), 2 tickets for 2nd Prize (15% split), and 5 tickets for 3rd Prize (20% split) from the pool of approved active tickets.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
                <div>• 1st Prize: ৳{Math.round(currentDraw.total_pool_amount * 0.15).toLocaleString()}</div>
                <div>• 2nd Prize: ৳{Math.round(currentDraw.total_pool_amount * 0.15 / 2).toLocaleString()} each (2 winners)</div>
                <div>• 3rd Prize: ৳{Math.round(currentDraw.total_pool_amount * 0.20 / 5).toLocaleString()} each (5 winners)</div>
              </div>

              <button
                type="button"
                disabled={drawExecuteLoading || currentDraw.total_tickets_sold === 0}
                onClick={() => handleExecuteDraw('random')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>{drawExecuteLoading ? 'Executing Draw...' : 'Execute Random Draw & Finalize'}</span>
              </button>
            </div>

            {/* Mode B: Manual Winner Selection */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-slate-200 text-sm font-bold">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Mode 2: Manual Ticket Override</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optionally specify exact ticket numbers for each winning tier. Useful for test simulations or ceremonial drawings.
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="1st Prize Ticket (e.g. BN-2026-948102)"
                  value={manualFirst}
                  onChange={(e) => setManualFirst(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs uppercase"
                />
                <input
                  type="text"
                  placeholder="2nd Prize Tickets (comma separated, up to 2)"
                  value={manualSecond}
                  onChange={(e) => setManualSecond(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs uppercase"
                />
                <input
                  type="text"
                  placeholder="3rd Prize Tickets (comma separated, up to 5)"
                  value={manualThird}
                  onChange={(e) => setManualThird(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs uppercase"
                />
              </div>

              <button
                type="button"
                disabled={drawExecuteLoading || !manualFirst.trim()}
                onClick={() => handleExecuteDraw('manual')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Publish Manual Winners</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FINANCIAL REPORTS & COMPANY SHARE TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              Confidential Financial Ledger: The 50% Company Share and retained earnings are strictly visible to authorized staff here and never shown on public user pages.
            </span>
          </div>

          {/* Primary Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">All-Time Ticket Sales</span>
              <span className="text-2xl font-black text-white font-mono tabular-nums mt-2">
                ৳{financialSummary.totalSalesAllTime.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                {financialSummary.totalTicketsAllTime.toLocaleString()} total tickets
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Prizes Distributed (50%)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-2">
                ৳{financialSummary.totalPrizesDistributed.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-400/80 mt-1">
                Paid out to winning participants
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/40 flex flex-col justify-between shadow-lg shadow-amber-500/5">
              <span className="text-xs text-slate-400 font-medium">Company Retained Share (50%)</span>
              <span className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-2">
                ৳{financialSummary.totalCompanyRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-amber-400/80 mt-1">
                Official platform net earnings
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Active Draw Pool</span>
              <span className="text-2xl font-black text-white font-mono tabular-nums mt-2">
                ৳{financialSummary.activeDrawSales.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                ৳{financialSummary.activeDrawCompanyReserve.toLocaleString()} company share queued
              </span>
            </div>
          </div>

          {/* Allocation Breakdown Table */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display">
              Pool Split Model Breakdown (Current Active Draw #{currentDraw.draw_number})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5">Category / Tier</th>
                    <th className="py-2.5">Winners Count</th>
                    <th className="py-2.5">Percentage</th>
                    <th className="py-2.5 text-right">Allocation Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-3 font-sans text-amber-400 font-bold">1st Prize</td>
                    <td className="py-3">1 Winner</td>
                    <td className="py-3">15%</td>
                    <td className="py-3 text-right text-amber-400 font-bold">৳{Math.round(currentDraw.total_pool_amount * 0.15).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-slate-200 font-bold">2nd Prize</td>
                    <td className="py-3">2 Winners (Equal)</td>
                    <td className="py-3">15% (7.5% each)</td>
                    <td className="py-3 text-right text-slate-200">৳{Math.round(currentDraw.total_pool_amount * 0.15).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-emerald-400 font-bold">3rd Prize</td>
                    <td className="py-3">5 Winners (Equal)</td>
                    <td className="py-3">20% (4% each)</td>
                    <td className="py-3 text-right text-emerald-400">৳{Math.round(currentDraw.total_pool_amount * 0.20).toLocaleString()}</td>
                  </tr>
                  <tr className="bg-amber-500/5">
                    <td className="py-3 font-sans text-amber-300 font-bold flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      <span>Company Retained Share</span>
                    </td>
                    <td className="py-3 font-sans text-slate-400">Platform Reserve</td>
                    <td className="py-3 font-bold text-amber-300">50%</td>
                    <td className="py-3 text-right font-black text-amber-300">৳{Math.round(currentDraw.total_pool_amount * 0.50).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. SETTINGS & GATEWAY CONFIGURATION TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Lottery Parameters & Gateway Recipients
              </h2>
              <p className="text-xs text-slate-400">
                Update payment receiver numbers, ticket prices, and scheduled draw dates
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          {settingsFeedback && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{settingsFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Ticket Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Ticket Price (BDT) *</label>
              <input
                type="number"
                min="1"
                value={formSettings.ticket_price}
                onChange={(e) => setFormSettings({ ...formSettings, ticket_price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Extra Charge */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Extra Fee Amount (BDT)</label>
              <input
                type="number"
                min="0"
                value={formSettings.extra_charge_amount}
                onChange={(e) => setFormSettings({ ...formSettings, extra_charge_amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* bKash Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">bKash Recipient Number *</label>
              <input
                type="text"
                value={formSettings.bkash_number}
                onChange={(e) => setFormSettings({ ...formSettings, bkash_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Nagad Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nagad Recipient Number *</label>
              <input
                type="text"
                value={formSettings.nagad_number}
                onChange={(e) => setFormSettings({ ...formSettings, nagad_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* USDT Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">USDT Wallet Address (TRC20) *</label>
              <input
                type="text"
                value={formSettings.usdt_address}
                onChange={(e) => setFormSettings({ ...formSettings, usdt_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Announcement Banner */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">Marquee Announcement Text</label>
              <input
                type="text"
                value={formSettings.banner_announcement}
                onChange={(e) => setFormSettings({ ...formSettings, banner_announcement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
