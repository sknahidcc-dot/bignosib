import React from 'react';
import { ShieldCheck, Sparkles, Lock, AlertCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050811] border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white font-display">BigNosib</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              BigNosib is Bangladesh&apos;s transparent digital lottery platform. Every ticket generates a cryptographically unique number with verifiable draw distributions.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/90 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Cryptographic Transparency</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home & Jackpot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lottery-buy')} className="hover:text-emerald-400 transition-colors">
                  Buy Lottery Ticket (৳50)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('draw-results')} className="hover:text-emerald-400 transition-colors">
                  Live Draws & Winners
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-emerald-400 transition-colors">
                  My Ticket Wallet
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Legal & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-emerald-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">
                  About Us & Security
                </button>
              </li>
              <li>
                <span className="text-slate-500">Official Support: support@bignosib.com</span>
              </li>
              <li className="pt-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Strictly 18+ Only
                </span>
              </li>
            </ul>
          </div>

          {/* Verified Payment Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Supported Gateways</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manual verification on mobile banking and cryptocurrency:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 bg-[#D81A60]/10 text-[#FF4081] border border-[#D81A60]/30 rounded text-xs font-semibold">
                bKash
              </span>
              <span className="px-2.5 py-1 bg-[#ED1C24]/10 text-[#FF5252] border border-[#ED1C24]/30 rounded text-xs font-semibold">
                Nagad
              </span>
              <span className="px-2.5 py-1 bg-[#26A17B]/10 text-[#26A17B] border border-[#26A17B]/30 rounded text-xs font-semibold font-mono">
                USDT (TRC20)
              </span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
                title="Management Portal"
              >
                <Lock className="w-3 h-3" />
                <span>Authorized Management Gate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Responsible gaming notice */}
        <div className="pt-6 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Play Responsibly. Lottery purchases are intended for entertainment. Participants must be at least 18 years old.
            </span>
          </div>
          <div>
            © {new Date().getFullYear()} BigNosib. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
