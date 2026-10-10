import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, ArrowRight, Loader2, QrCode, Wallet, Sparkles } from 'lucide-react';
import { Draw, Ticket, TicketOrder, UserProfile } from '../types/lottery';
import { LotteryStore } from '../lib/store';

interface DirectCheckoutModalProps {
  isOpen: boolean;
  method: 'bkash' | 'nagad' | 'usdt';
  amount: number;
  quantity: number;
  unitPrice: number;
  extraCharge: number;
  user: UserProfile;
  currentDraw: Draw;
  onClose: () => void;
  onSuccess: (order: TicketOrder, tickets: Ticket[]) => void;
}

export const DirectCheckoutModal: React.FC<DirectCheckoutModalProps> = ({
  isOpen,
  method,
  amount,
  quantity,
  unitPrice,
  extraCharge,
  user,
  currentDraw,
  onClose,
  onSuccess,
}) => {
  // bKash & Nagad Steps: 1: Phone, 2: OTP, 3: PIN, 4: Processing
  const [step, setStep] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('TX9kL2RmvYp7z8WJ1bC5vNx4aD7qEsF9hT');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // USDT Web3 state
  const [cryptoTimeLeft, setCryptoTimeLeft] = useState(900); // 15 mins

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber(user.phone || '');
      setOtp('');
      setPin('');
      setErrorMessage('');
      setLoading(false);
    }
  }, [isOpen, user.phone]);

  useEffect(() => {
    if (!isOpen || method !== 'usdt') return;
    const interval = setInterval(() => {
      setCryptoTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, method]);

  if (!isOpen) return null;

  const usdtEquivalent = (amount / 125).toFixed(2);

  // Helper to generate simulated unique transaction IDs
  const generateDirectTrxId = (m: string) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const prefix = m === 'bkash' ? 'BKS' : m === 'nagad' ? 'NGD' : 'TX';
    return `${prefix}${Date.now().toString().slice(-4)}${code}`;
  };

  // Process bKash / Nagad payment completion
  const handleCompletePayment = () => {
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const generatedTrx = generateDirectTrxId(method);

      const res = LotteryStore.createDirectApprovedOrder({
        user_id: user.id,
        draw_id: currentDraw.id,
        quantity,
        unit_price: unitPrice,
        extra_charge: extraCharge,
        total_amount: amount,
        payment_method: method,
        transaction_id: generatedTrx,
        sender_number: method === 'usdt' ? 'TRC20-DirectWallet' : phoneNumber,
        user_name: user.full_name,
        user_phone: user.phone,
        user_email: user.email,
      });

      setLoading(false);

      if (res.success && res.order && res.ticketsCreated) {
        onSuccess(res.order, res.ticketsCreated);
      } else {
        setErrorMessage(res.message || 'Payment processing failed. Please try again.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transition-all border border-slate-700/80 bg-[#0F172A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ------------------- BKASH DIRECT GATEWAY ------------------- */}
        {method === 'bkash' && (
          <div>
            {/* Header */}
            <div className="bg-[#D81A60] p-6 text-white text-center relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                <span className="text-[#D81A60] font-black text-2xl font-display">b</span>
              </div>
              <h3 className="text-xl font-black font-display tracking-tight">bKash Payment Gateway</h3>
              <p className="text-xs text-white/80 mt-0.5">Direct Instant Checkout</p>

              <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-between text-xs">
                <span>Merchant: <strong>BigNosib</strong></span>
                <span className="text-base font-black font-mono">৳{amount}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 bg-[#0B0F19] text-slate-100">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Enter Phone */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Your bKash Account Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-[#D81A60]"
                    />
                    <span className="text-[11px] text-slate-400">
                      By clicking Proceed, you agree to the bKash terms.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!phoneNumber.trim()) {
                        setErrorMessage('Please enter your bKash number.');
                        return;
                      }
                      setErrorMessage('');
                      setStep(2);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#D81A60] hover:bg-[#C2185B] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                  >
                    Proceed
                  </button>
                </div>
              )}

              {/* Step 2: Enter Verification Code (OTP) */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      bKash Verification Code (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-[#D81A60]"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Sent to {phoneNumber}</span>
                      <button
                        type="button"
                        onClick={() => setOtp('123456')}
                        className="text-[#FF4081] hover:underline font-semibold"
                      >
                        Auto-fill demo (123456)
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!otp.trim()) {
                          setErrorMessage('Please enter the verification code.');
                          return;
                        }
                        setErrorMessage('');
                        setStep(3);
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#D81A60] hover:bg-[#C2185B] text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Confirm OTP
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Enter bKash PIN */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Enter bKash PIN
                    </label>
                    <input
                      type="password"
                      maxLength={5}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="•••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-[#D81A60]"
                    />
                    <span className="text-[11px] text-slate-400">
                      Your PIN is securely encrypted with 256-bit SSL.
                    </span>
                  </div>

                  <button
                    onClick={handleCompletePayment}
                    disabled={loading || !pin.trim()}
                    className="w-full py-3.5 rounded-xl bg-[#D81A60] hover:bg-[#C2185B] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Minting Tickets...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirm Payment (৳{amount})</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------- NAGAD DIRECT GATEWAY ------------------- */}
        {method === 'nagad' && (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ED1C24] to-[#F15A24] p-6 text-white text-center relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                <span className="text-[#ED1C24] font-black text-2xl font-display">N</span>
              </div>
              <h3 className="text-xl font-black font-display tracking-tight">Nagad Online Gateway</h3>
              <p className="text-xs text-white/80 mt-0.5">Direct Instant Checkout</p>

              <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-between text-xs">
                <span>Merchant: <strong>BigNosib</strong></span>
                <span className="text-base font-black font-mono">৳{amount}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 bg-[#0B0F19] text-slate-100">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Enter Phone */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Your Nagad Account Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 018XXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-[#ED1C24]"
                    />
                    <span className="text-[11px] text-slate-400">
                      Standard Nagad digital payment terms apply.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!phoneNumber.trim()) {
                        setErrorMessage('Please enter your Nagad account number.');
                        return;
                      }
                      setErrorMessage('');
                      setStep(2);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#ED1C24] hover:bg-[#D4171E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                  >
                    Proceed
                  </button>
                </div>
              )}

              {/* Step 2: Enter OTP */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Nagad OTP Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-[#ED1C24]"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Sent to {phoneNumber}</span>
                      <button
                        type="button"
                        onClick={() => setOtp('654321')}
                        className="text-[#FF5252] hover:underline font-semibold"
                      >
                        Auto-fill demo (654321)
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!otp.trim()) {
                          setErrorMessage('Please enter the OTP.');
                          return;
                        }
                        setErrorMessage('');
                        setStep(3);
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D4171E] text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Enter Nagad PIN */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Enter Nagad 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-[#ED1C24]"
                    />
                  </div>

                  <button
                    onClick={handleCompletePayment}
                    disabled={loading || !pin.trim()}
                    className="w-full py-3.5 rounded-xl bg-[#ED1C24] hover:bg-[#D4171E] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming with Nagad...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize Payment (৳{amount})</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------- CRYPTO USDT DIRECT / WEB3 ------------------- */}
        {method === 'usdt' && (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#26A17B] to-[#1D7F60] p-6 text-white text-center relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                <span className="text-[#26A17B] font-black text-xl font-mono">₮</span>
              </div>
              <h3 className="text-xl font-black font-display tracking-tight">USDT TRC20 Web3 Gateway</h3>
              <p className="text-xs text-white/80 mt-0.5">Direct On-Chain Payment</p>

              <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-between text-xs">
                <span>Amount: <strong>${usdtEquivalent} USDT</strong></span>
                <span className="font-mono text-emerald-200">৳{amount} BDT</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 bg-[#0B0F19] text-slate-100">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Dynamic QR & Timer */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow">
                  {/* Simulated QR matrix */}
                  <div className="w-full h-full bg-slate-950 p-1 rounded grid grid-cols-6 gap-0.5">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-[1px] ${
                          (i * 7) % 5 === 0 || i % 7 === 0 || i === 0 || i === 5 || i === 30 || i === 35
                            ? 'bg-emerald-400'
                            : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  Deposit Window Closes In:{' '}
                  <span className="font-mono font-bold text-amber-400">
                    {Math.floor(cryptoTimeLeft / 60)}:{(cryptoTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 break-all">
                  {cryptoAddress}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleCompletePayment}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#26A17B] hover:bg-[#1f8766] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying On-Chain Transfer...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Pay ${usdtEquivalent} USDT (Instant Mint)</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-500 text-center">
                Supported via TronLink, Binance Pay, Trust Wallet, and OKX TRC20 network.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
