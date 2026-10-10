import React from 'react';
import { ShieldCheck, Award, HeartHandshake, AlertTriangle, ArrowRight, Home } from 'lucide-react';

interface StaticPageProps {
  onNavigate: (view: string) => void;
}

export const AboutUsView: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
          About BigNosib
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Bangladesh&apos;s pioneering digital lottery ecosystem built on integrity, verified payment matching, and provably fair draws.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Full Transparency</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every ticket minted has an unforgeable unique serial code. Draws are executed in strict accordance with the announced mathematical distribution formula.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Accessible & Fair</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standard ৳50 ticket price allows everyday citizens to participate seamlessly through trusted local gateways like bKash, Nagad, and USDT.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Rapid Payouts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Winners are verified swiftly and prizes are disbursed directly to the winner&apos;s registered mobile banking or crypto wallet.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white">Our Mission & Principles</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          BigNosib was founded to eliminate opacity in digital prize contests. Traditional paper tickets are prone to loss, damage, and counterfeiting. By combining human manual payment verification with digital cryptography and real-time ledger accounting, BigNosib ensures every ticket holder has a fair, verifiable chance to win.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('lottery-buy')}
            className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-emerald-300 transition-colors"
          >
            <span>Participate in Active Draw (৳50)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsView: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 • Please read carefully before purchasing tickets
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>1. Eligibility & Age Verification</span>
          </h3>
          <p>
            Participation on BigNosib is strictly limited to individuals who are 18 years of age or older. By registering and submitting ticket orders, you represent and warrant that you meet this legal age requirement.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">2. Payment Verification & Order Submissions</h3>
          <p>
            Ticket purchases require manual verification of the transaction identifier (TrxID) sent via bKash, Nagad, or Tether (USDT). Any fraudulent, forged, or duplicate Transaction IDs will result in immediate disqualification and account termination without refund.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">3. Unique Ticket Issuance & Non-Refundability</h3>
          <p>
            Upon manual administrative approval, official unique ticket codes (format BN-YYYY-XXXXX) are generated. Once generated and admitted into the active draw pool, ticket orders cannot be cancelled, refunded, or transferred.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">4. Prize Distribution & Ticket Expiry</h3>
          <p>
            Winners receive guaranteed direct cash prizes according to their winning category (1st Prize, 2nd Prize, and 3rd Prize). Payouts are transferred directly to the winner&apos;s verified account. Once a draw is finalized, all participating tickets expire and will not carry over to subsequent draws.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">5. Responsible Gaming</h3>
          <p>
            Lottery participation should be regarded as entertainment. Only wager amounts you can comfortably afford. If you suspect unhealthy habits, please contact support or professional counseling resources.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <span className="text-slate-500 text-xs">Questions regarding these terms? Contact legal@bignosib.com</span>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundView: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white font-display">404</h1>
      <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
      <p className="text-xs text-slate-400 leading-relaxed">
        The page you are looking for does not exist or has been relocated.
      </p>
      <button
        onClick={() => onNavigate('home')}
        className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </button>
    </div>
  );
};
