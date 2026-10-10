/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { LotteryBuyView } from './views/LotteryBuyView';
import { DrawResultsView } from './views/DrawResultsView';
import { AccountView } from './views/AccountView';
import { LoginView, RegisterView, ForgotPasswordView } from './views/AuthViews';
import { AboutUsView, TermsView, NotFoundView } from './views/StaticPages';
import { AdminView } from './views/AdminView';

import { LotteryStore } from './lib/store';
import { AuthService } from './lib/auth';
import { Draw, DrawWinner, SystemSettings, Ticket, TicketOrder, UserProfile } from './types/lottery';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());

  // App Data State
  const [settings, setSettings] = useState<SystemSettings>(LotteryStore.getSettings());
  const [currentDraw, setCurrentDraw] = useState<Draw>(LotteryStore.getCurrentDraw());
  const [pastDraws, setPastDraws] = useState<Draw[]>(LotteryStore.getPastDraws());
  const [orders, setOrders] = useState<TicketOrder[]>(LotteryStore.getOrders());
  const [tickets, setTickets] = useState<Ticket[]>(LotteryStore.getTickets());
  const [winners, setWinners] = useState<DrawWinner[]>(LotteryStore.getWinners());

  const refreshAllData = () => {
    setSettings(LotteryStore.getSettings());
    setCurrentDraw(LotteryStore.getCurrentDraw());
    setPastDraws(LotteryStore.getPastDraws());
    setOrders(LotteryStore.getOrders());
    setTickets(LotteryStore.getTickets());
    setWinners(LotteryStore.getWinners());
    setCurrentUser(AuthService.getCurrentUser());
  };

  // Sync state and handle URL path matching (e.g. /np/error)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.includes('/np/error') || hash.includes('/np/error') || hash === '#admin') {
        setCurrentView('admin');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Navigation controller with Protected Routes
  const handleNavigate = (view: string) => {
    if (view === 'account' && !currentUser) {
      setCurrentView('login');
      return;
    }
    if (view === 'admin') {
      window.history.pushState({}, '', '/np/error');
    } else if (window.location.pathname.includes('/np/error')) {
      window.history.pushState({}, '', '/');
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    // User requirement: Login success -> redirect to Lottery Buy page
    setCurrentView('lottery-buy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = () => {
    // User requirement: Registration success -> redirect to Login page
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    // User requirement: Logout -> redirect to Login page
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userOrders = currentUser ? orders.filter(o => o.user_id === currentUser.id) : [];
  const userTickets = currentUser ? tickets.filter(t => t.user_id === currentUser.id) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F1D] text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Marquee Announcement Bar */}
      {settings.banner_announcement && currentView !== 'admin' && (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/15 to-amber-500/10 border-b border-emerald-500/20 py-2 px-4 text-center text-[11px] sm:text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{settings.banner_announcement}</span>
        </div>
      )}

      {/* Primary Site Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            currentDraw={currentDraw}
            winners={winners}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'lottery-buy' && (
          <LotteryBuyView
            currentUser={currentUser}
            settings={settings}
            currentDraw={currentDraw}
            onNavigate={handleNavigate}
            onOrderSubmitted={refreshAllData}
          />
        )}

        {currentView === 'draw-results' && (
          <DrawResultsView
            currentDraw={currentDraw}
            pastDraws={pastDraws}
            allWinners={winners}
            userTickets={userTickets}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'account' && currentUser && (
          <AccountView
            currentUser={currentUser}
            userOrders={userOrders}
            userTickets={userTickets}
            onProfileUpdated={(updated) => {
              setCurrentUser(updated);
              refreshAllData();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            onRegisterSuccess={handleRegisterSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPasswordView onNavigate={handleNavigate} />
        )}

        {currentView === 'about' && (
          <AboutUsView onNavigate={handleNavigate} />
        )}

        {currentView === 'terms' && (
          <TermsView onNavigate={handleNavigate} />
        )}

        {currentView === 'admin' && (
          <AdminView
            settings={settings}
            currentDraw={currentDraw}
            orders={orders}
            winners={winners}
            onRefreshData={refreshAllData}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {![
          'home',
          'lottery-buy',
          'draw-results',
          'account',
          'login',
          'register',
          'forgot-password',
          'about',
          'terms',
          'admin',
        ].includes(currentView) && (
          <NotFoundView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Site Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
