import React, { useState } from 'react';
import {
  Ticket,
  Copy,
  Check,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Zap,
  Clock,
  ShieldCheck,
  Info,
  ChevronRight,
  X,
} from 'lucide-react';
import { Draw, SystemSettings, Ticket as TicketType, TicketOrder, UserProfile } from '../types/lottery';
import { LotteryStore } from '../lib/store';
import { DirectCheckoutModal } from '../components/DirectCheckoutModal';
import { TicketCard } from '../components/TicketCard';

interface LotteryBuyViewProps {
  currentUser: UserProfile | null;
  settings: SystemSettings;
  currentDraw: Draw;
  onNavigate: (view: string) => void;
  onOrderSubmitted?: () => void;
}

export const LotteryBuyView: React.FC<LotteryBuyViewProps> = ({
  currentUser,
  settings,
  currentDraw,
  onNavigate,
  onOrderSubmitted,
}) => {
  // Mode: 'manual' (Default first tab) vs 'direct' (Second tab)
  const [checkoutMode, setCheckoutMode] = useState<'manual' | 'direct'>('manual');
  const [showDirectNotice, setShowDirectNotice] = useState(false);

  // Quantity & Method
  const [quantity, setQuantity] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'usdt'>('bkash');

  // Manual submission form state
  const [senderAccount, setSenderAccount] = useState(currentUser?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOrder, setSuccessOrder] = useState<TicketOrder | null>(null);
  const [instantTickets, setInstantTickets] = useState<TicketType[]>([]);

  // Direct modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If not logged in, prompt user to log in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <Ticket className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-white font-display">Authentication Required</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          You must be logged in to purchase official lottery tickets and manage your verifiable draw credentials.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="flex-1 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  const unitPrice = settings.ticket_price || 50;
  const extraCharge = settings.extra_charge_amount || 0;
  const subtotal = quantity * unitPrice;
  const totalAmount = subtotal + extraCharge;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Manual payment submission handler
  const handleManualSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!transactionId.trim()) {
      setErrorMessage('Please enter the Transaction ID (TrxID / Hash) received from your payment.');
      return;
    }

    if (!senderAccount.trim()) {
      setErrorMessage('Please enter the sender phone number or wallet address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = LotteryStore.submitOrder({
        user_id: currentUser.id,
        draw_id: currentDraw.id,
        quantity,
        unit_price: unitPrice,
        extra_charge: extraCharge,
        total_amount: totalAmount,
        payment_method: selectedMethod,
        transaction_id: transactionId.trim(),
        sender_number: senderAccount.trim(),
        user_name: currentUser.full_name,
        user_phone: currentUser.phone,
        user_email: currentUser.email,
      });

      setLoading(false);

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessOrder(res.order || null);
        setInstantTickets([]);
        if (onOrderSubmitted) onOrderSubmitted();
      }
    }, 400);
  };

  // Direct checkout success handler
  const handleDirectSuccess = (order: TicketOrder, tickets: TicketType[]) => {
    setIsModalOpen(false);
    setSuccessOrder(order);
    setInstantTickets(tickets);
    if (onOrderSubmitted) onOrderSubmitted();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Direct Modal */}
      <DirectCheckoutModal
        isOpen={isModalOpen}
        method={selectedMethod}
        amount={totalAmount}
        quantity={quantity}
        unitPrice={unitPrice}
        extraCharge={extraCharge}
        user={currentUser}
        currentDraw={currentDraw}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleDirectSuccess}
      />

      {/* Direct Payment Notice Popup (Under Development) */}
      {showDirectNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0F172A] border border-amber-500/40 space-y-5 shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowDirectNotice(false)}
              className="absolute right-4 top-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-lg">
              <Zap className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white font-display">
                Direct Payment Under Maintenance
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Please make your payment via Manual Payment for now. The Direct Payment automated gateway integration is currently under development.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
              <div className="font-semibold text-slate-300">Quick Manual Payment Steps:</div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                1. Switch to <strong className="text-emerald-400">Manual Payment</strong><br />
                2. Send Money to our official bKash, Nagad, or USDT wallet<br />
                3. Enter your Transaction ID (TrxID) for prompt approval.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDirectNotice(false);
                  setCheckoutMode('manual');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Continue with Manual Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowDirectNotice(false)}
                className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
          <Ticket className="w-3.5 h-3.5" />
          <span>Draw #{currentDraw.draw_number} • Price ৳{unitPrice} per Ticket</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Buy BigNosib Lottery Tickets
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Choose between instant direct gateway payment or manual TrxID verification.
        </p>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {successOrder ? (
        <div className="rounded-3xl bg-slate-900/90 border border-emerald-500/40 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white font-display">
              {instantTickets.length > 0 ? 'Tickets Minted Successfully!' : 'Order Submitted for Verification!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Payment of <span className="font-bold text-amber-400 font-mono">৳{successOrder.total_amount}</span> for <span className="font-bold text-emerald-400">{successOrder.quantity} ticket(s)</span> recorded.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Transaction ID:</span>
              <span className="text-white font-bold">{successOrder.transaction_id}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Gateway:</span>
              <span className="text-emerald-400 uppercase">{successOrder.payment_method}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className={`font-bold uppercase ${successOrder.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {successOrder.status === 'approved' ? 'Approved & In Draw' : 'Pending Verification'}
              </span>
            </div>
          </div>

          {/* If instant tickets were minted, preview them right away! */}
          {instantTickets.length > 0 && (
            <div className="space-y-3 pt-2 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Newly Minted Tickets:
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {instantTickets.map((t) => (
                  <TicketCard key={t.id} ticket={t} />
                ))}
              </div>
            </div>
          )}

          {successOrder.status === 'pending' && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 text-left flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Our staff will verify your Transaction ID within 15–30 minutes. Once approved, your tickets will appear in your Account ticket wallet!
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => onNavigate('account')}
              className="flex-1 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Go to My Account & Wallet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSuccessOrder(null);
                setInstantTickets([]);
                setTransactionId('');
              }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              Buy More Tickets
            </button>
          </div>
        </div>
      ) : (
        /* PURCHASE WORKFLOW */
        <div className="space-y-8">
          {/* Top Payment Mode Toggle: Manual (First) vs Direct (Second) */}
          <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto grid grid-cols-2 gap-1.5">
            {/* Button 1: Manual Payment System (First) */}
            <button
              type="button"
              onClick={() => setCheckoutMode('manual')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                checkoutMode === 'manual'
                  ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Manual Payment</span>
            </button>

            {/* Button 2: Direct Payment System (Second) */}
            <button
              type="button"
              onClick={() => {
                setCheckoutMode('direct');
                setShowDirectNotice(true);
              }}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                checkoutMode === 'direct'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Direct Payment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Quantity & Method Selection */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Quantity Selection */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Step 1: Choose Quantity
                  </span>
                  <span className="text-xs font-mono text-emerald-400">৳{unitPrice} per ticket</span>
                </div>

                {/* Quick Select Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 5, 10, 20].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        quantity === q
                          ? 'bg-emerald-400 text-slate-950 shadow-sm'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {q} {q === 1 ? 'Ticket' : 'Tickets'}
                    </button>
                  ))}
                </div>

                {/* Custom Number Input */}
                <div className="flex items-center gap-3 pt-1">
                  <label className="text-xs text-slate-400 shrink-0">Custom quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Step 2: Payment Method Selection */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Step 2: Select Payment Method
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {checkoutMode === 'direct' ? '⚡ Instant Gateway' : '📋 Manual Send Money'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bkash')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'bkash'
                        ? 'border-[#D81A60] bg-[#D81A60]/10 shadow-sm ring-1 ring-[#D81A60]'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                    }`}
                  >
                    <span className="text-xs font-black text-[#FF4081]">bKash</span>
                    <span className="text-[11px] text-slate-400 mt-2">
                      {checkoutMode === 'direct' ? 'Instant Pay' : settings.bkash_type || 'Personal'}
                    </span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('nagad')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'nagad'
                        ? 'border-[#ED1C24] bg-[#ED1C24]/10 shadow-sm ring-1 ring-[#ED1C24]'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                    }`}
                  >
                    <span className="text-xs font-black text-[#FF5252]">Nagad</span>
                    <span className="text-[11px] text-slate-400 mt-2">
                      {checkoutMode === 'direct' ? 'Instant Pay' : settings.nagad_type || 'Personal'}
                    </span>
                  </button>

                  {/* USDT */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('usdt')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'usdt'
                        ? 'border-[#26A17B] bg-[#26A17B]/10 shadow-sm ring-1 ring-[#26A17B]'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                    }`}
                  >
                    <span className="text-xs font-black text-[#26A17B]">USDT (Crypto)</span>
                    <span className="text-[11px] text-slate-400 mt-2">
                      {checkoutMode === 'direct' ? 'Web3 / QR' : 'TRC20 Wallet'}
                    </span>
                  </button>
                </div>

                {/* If in manual mode, show the copyable details */}
                {checkoutMode === 'manual' && (
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Send ৳{totalAmount} via Send Money to:</span>
                      <span className="text-emerald-400 font-semibold uppercase">{selectedMethod}</span>
                    </div>

                    {selectedMethod === 'bkash' && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div>
                          <div className="text-[11px] text-slate-400">bKash Send Money Number</div>
                          <div className="text-base font-bold text-white font-mono">{settings.bkash_number}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(settings.bkash_number.replace(/\D/g, ''), 'bkash')}
                          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1"
                        >
                          {copiedField === 'bkash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'bkash' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {selectedMethod === 'nagad' && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div>
                          <div className="text-[11px] text-slate-400">Nagad Send Money Number</div>
                          <div className="text-base font-bold text-white font-mono">{settings.nagad_number}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(settings.nagad_number.replace(/\D/g, ''), 'nagad')}
                          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1"
                        >
                          {copiedField === 'nagad' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'nagad' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {selectedMethod === 'usdt' && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="overflow-hidden mr-2">
                          <div className="text-[11px] text-slate-400">USDT {settings.usdt_network} Address</div>
                          <div className="text-xs font-bold text-white font-mono truncate">{settings.usdt_address}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(settings.usdt_address, 'usdt')}
                          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1 shrink-0"
                        >
                          {copiedField === 'usdt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'usdt' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* If in direct mode, show a high-converting instant checkout banner */}
                {checkoutMode === 'direct' && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Zap className="w-4 h-4 shrink-0" />
                      <span>Instant checkout enabled. No manual review needed.</span>
                    </div>
                    <span className="font-semibold text-white uppercase text-[11px]">
                      {selectedMethod} Direct
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Checkout or Submission Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
                <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
                  Order Summary & Checkout
                </h3>

                {/* Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Tickets ({quantity} × ৳{unitPrice})</span>
                    <span className="text-white font-mono">৳{subtotal}</span>
                  </div>
                  {extraCharge > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>{settings.extra_charge_name}</span>
                      <span className="text-white font-mono">৳{extraCharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-2 text-sm">
                    <span>Total Amount:</span>
                    <span className="text-emerald-400 font-mono text-base font-black">৳{totalAmount}</span>
                  </div>
                </div>

                {/* ---------------- DIRECT PAYMENT BUTTON ---------------- */}
                {checkoutMode === 'direct' ? (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Click below to open the direct <strong className="text-white uppercase">{selectedMethod}</strong> payment interface. Your tickets will be created immediately upon PIN/Web3 authorization.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowDirectNotice(true)}
                      className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 text-white ${
                        selectedMethod === 'bkash'
                          ? 'bg-[#D81A60] hover:bg-[#C2185B] shadow-[#D81A60]/20'
                          : selectedMethod === 'nagad'
                          ? 'bg-[#ED1C24] hover:bg-[#D4171E] shadow-[#ED1C24]/20'
                          : 'bg-[#26A17B] hover:bg-[#1f8766] shadow-[#26A17B]/20'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Pay ৳{totalAmount} via {selectedMethod.toUpperCase()} Direct</span>
                    </button>

                    <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Secured with official API encryption & zero delay</span>
                    </div>
                  </div>
                ) : (
                  /* ---------------- MANUAL PAYMENT FORM ---------------- */
                  <form onSubmit={handleManualSubmitOrder} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Sender Phone Number / Wallet *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 017XXXXXXXX"
                        value={senderAccount}
                        onChange={(e) => setSenderAccount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Transaction ID (TrxID / Hash) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9J8B7C6D5E"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-400 uppercase"
                      />
                      <span className="text-[11px] text-slate-500">
                        Duplicate Transaction IDs are automatically rejected.
                      </span>
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Submit For Admin Approval (৳{totalAmount})</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
