import { Draw, DrawWinner, PrizeTier, SystemSettings, Ticket, TicketOrder, UserProfile } from '../types/lottery';

const STORAGE_KEYS = {
  SETTINGS: 'bignosib_settings_v1',
  CURRENT_DRAW: 'bignosib_current_draw_v1',
  PAST_DRAWS: 'bignosib_past_draws_v1',
  ORDERS: 'bignosib_orders_v1',
  TICKETS: 'bignosib_tickets_v1',
  WINNERS: 'bignosib_winners_v2',
  USERS: 'bignosib_users_v1',
  AUTH_USER: 'bignosib_auth_user_v1',
  ADMIN_TOKEN: 'bignosib_admin_token_v1',
};

// Next Sunday 8:00 PM calculation
function getNextDrawDate(): string {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const daysUntilSunday = (7 - day) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(20, 0, 0, 0); // 8:00 PM
  return nextSunday.toISOString();
}

const DEFAULT_SETTINGS: SystemSettings = {
  ticket_price: 50,
  extra_charge_name: 'Gateway Processing Fee',
  extra_charge_amount: 0,
  bkash_number: '01712-345678',
  bkash_type: 'Personal (Send Money)',
  nagad_number: '01812-987654',
  nagad_type: 'Personal (Send Money)',
  usdt_address: 'TX9kL2RmvYp7z8WJ1bC5vNx4aD7qEsF9hT',
  usdt_network: 'TRC20 (Tether USD)',
  next_draw_time: getNextDrawDate(),
  draw_frequency: 'Weekly (Every Sunday 8:00 PM)',
  banner_announcement: 'Weekly Mega Draw #48 is LIVE! Buy your official ticket for just ৳50 and win exciting cash prizes!',
};

const DEFAULT_CURRENT_DRAW: Draw = {
  id: 'draw-48',
  draw_number: 48,
  title: 'Weekly Mega Jackpot Draw #48',
  draw_date: getNextDrawDate(),
  total_tickets_sold: 1420,
  total_pool_amount: 71000,
  first_prize_pool: 10650, // 15%
  second_prize_pool: 10650, // 15% (5325 each)
  third_prize_pool: 14200, // 20% (2840 each)
  company_share: 35500, // 50%
  status: 'active',
};

const INITIAL_WINNERS: DrawWinner[] = [
  {
    id: 'win-1',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-1',
    ticket_number: 'BN-2026-948102',
    user_id: 'u-1',
    prize_tier: '1st',
    prize_amount: 9750,
    masked_phone: '01712*****',
    masked_email: 'ka***@gmail.com',
    full_name: 'Kamrul Hassan',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'win-2',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-2',
    ticket_number: 'BN-2026-831094',
    user_id: 'u-2',
    prize_tier: '2nd',
    prize_amount: 4875,
    masked_phone: '01819*****',
    masked_email: 'ta***@yahoo.com',
    full_name: 'Tareq Mahmud',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'win-3',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-3',
    ticket_number: 'BN-2026-720194',
    user_id: 'u-3',
    prize_tier: '2nd',
    prize_amount: 4875,
    masked_phone: '01911*****',
    masked_email: 'sh***@gmail.com',
    full_name: 'Shah Alam',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'win-4',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-4',
    ticket_number: 'BN-2026-519208',
    user_id: 'u-4',
    prize_tier: '3rd',
    prize_amount: 2600,
    masked_phone: '01614*****',
    masked_email: 'ra***@gmail.com',
    full_name: 'Rashedul Islam',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'win-5',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-5',
    ticket_number: 'BN-2026-612940',
    user_id: 'u-5',
    prize_tier: '3rd',
    prize_amount: 2600,
    masked_phone: '01733*****',
    masked_email: 'fa***@outlook.com',
    full_name: 'Farhana Akter',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'win-6',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-6',
    ticket_number: 'BN-2026-440219',
    user_id: 'u-6',
    prize_tier: '3rd',
    prize_amount: 2600,
    masked_phone: '01815*****',
    masked_email: 'me***@gmail.com',
    full_name: 'Mehedi Hasan',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'win-7',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-7',
    ticket_number: 'BN-2026-382910',
    user_id: 'u-7',
    prize_tier: '3rd',
    prize_amount: 2600,
    masked_phone: '01924*****',
    masked_email: 'nu***@gmail.com',
    full_name: 'Nusrat Jahan',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'win-8',
    draw_id: 'draw-47',
    draw_number: 47,
    ticket_id: 't-47-8',
    ticket_number: 'BN-2026-291048',
    user_id: 'u-8',
    prize_tier: '3rd',
    prize_amount: 2600,
    masked_phone: '01552*****',
    masked_email: 'al***@gmail.com',
    full_name: 'Al-Amin Sheikh',
    announced_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const INITIAL_PAST_DRAWS: Draw[] = [
  {
    id: 'draw-47',
    draw_number: 47,
    title: 'Weekly Mega Jackpot Draw #47',
    draw_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    total_tickets_sold: 1300,
    total_pool_amount: 65000,
    first_prize_pool: 9750,
    second_prize_pool: 9750,
    third_prize_pool: 13000,
    company_share: 32500,
    status: 'completed',
    completed_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    winning_tickets: {
      first: ['BN-2026-948102'],
      second: ['BN-2026-831094', 'BN-2026-720194'],
      third: ['BN-2026-519208', 'BN-2026-612940', 'BN-2026-440219', 'BN-2026-382910', 'BN-2026-291048'],
    },
  },
  {
    id: 'draw-46',
    draw_number: 46,
    title: 'Weekly Mega Jackpot Draw #46',
    draw_date: new Date(Date.now() - 14 * 86400000).toISOString(),
    total_tickets_sold: 1180,
    total_pool_amount: 59000,
    first_prize_pool: 8850,
    second_prize_pool: 8850,
    third_prize_pool: 11800,
    company_share: 29500,
    status: 'completed',
    completed_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    winning_tickets: {
      first: ['BN-2026-118492'],
      second: ['BN-2026-284910', 'BN-2026-391024'],
      third: ['BN-2026-482019', 'BN-2026-582019', 'BN-2026-682019', 'BN-2026-782019', 'BN-2026-882019'],
    },
  },
];

// Helper to safely read from localStorage
function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Helper to safely write to localStorage
function writeStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export function maskPhone(phone: string): string {
  if (!phone) return '01700*****';
  const clean = phone.replace(/\D/g, '');
  if (clean.length <= 5) return clean + '*****';
  return clean.substring(0, 5) + '*****';
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'us***@bignosib.com';
  const [user, domain] = email.split('@');
  const visible = user.length <= 2 ? user : user.substring(0, 2);
  return `${visible}***@${domain}`;
}

export class LotteryStore {
  // Settings
  static getSettings(): SystemSettings {
    return readStorage<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  static updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    const curr = this.getSettings();
    const updated = { ...curr, ...newSettings };
    writeStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // Current Draw
  static getCurrentDraw(): Draw {
    const draw = readStorage<Draw>(STORAGE_KEYS.CURRENT_DRAW, DEFAULT_CURRENT_DRAW);
    return draw;
  }

  static getPastDraws(): Draw[] {
    return readStorage<Draw[]>(STORAGE_KEYS.PAST_DRAWS, INITIAL_PAST_DRAWS);
  }

  // Orders
  static getOrders(): TicketOrder[] {
    return readStorage<TicketOrder[]>(STORAGE_KEYS.ORDERS, []);
  }

  static getUserOrders(userId: string): TicketOrder[] {
    return this.getOrders().filter(o => o.user_id === userId);
  }

  static submitOrder(orderData: Omit<TicketOrder, 'id' | 'status' | 'created_at'>): { success: boolean; message: string; order?: TicketOrder } {
    const orders = this.getOrders();
    const cleanTxn = orderData.transaction_id.trim().toUpperCase();

    // Check duplicate Transaction ID
    const exists = orders.some(o => o.transaction_id.trim().toUpperCase() === cleanTxn);
    if (exists) {
      return {
        success: false,
        message: 'This Transaction ID has already been submitted. Duplicate submissions are strictly rejected.',
      };
    }

    const newOrder: TicketOrder = {
      ...orderData,
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      transaction_id: cleanTxn,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    writeStorage(STORAGE_KEYS.ORDERS, orders);
    return { success: true, message: 'Your ticket order has been submitted for manual admin verification.', order: newOrder };
  }

  // Direct Payment Gateway Checkout: Instantly creates approved order & mints tickets
  static createDirectApprovedOrder(orderData: Omit<TicketOrder, 'id' | 'status' | 'created_at'>): {
    success: boolean;
    message: string;
    order?: TicketOrder;
    ticketsCreated?: Ticket[];
  } {
    const orders = this.getOrders();
    const cleanTxn = orderData.transaction_id.trim().toUpperCase();

    // Check duplicate
    const exists = orders.some(o => o.transaction_id.trim().toUpperCase() === cleanTxn);
    if (exists) {
      return {
        success: false,
        message: 'This Transaction ID is already registered.',
      };
    }

    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newOrder: TicketOrder = {
      ...orderData,
      id: orderId,
      transaction_id: cleanTxn,
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const currentTickets = this.getTickets();
    const existingTicketNumbers = new Set(currentTickets.map(t => t.ticket_number));
    const createdTickets: Ticket[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < newOrder.quantity; i++) {
      let uniqueNum = '';
      while (true) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        uniqueNum = `BN-${currentYear}-${rand}`;
        if (!existingTicketNumbers.has(uniqueNum)) {
          existingTicketNumbers.add(uniqueNum);
          break;
        }
      }

      const ticket: Ticket = {
        id: `tkt-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
        ticket_number: uniqueNum,
        order_id: newOrder.id,
        user_id: newOrder.user_id,
        draw_id: newOrder.draw_id,
        is_winner: false,
        prize_amount: 0,
        status: 'valid',
        created_at: new Date().toISOString(),
        buyer_name: newOrder.user_name,
        buyer_phone: newOrder.user_phone,
      };
      createdTickets.push(ticket);
    }

    orders.unshift(newOrder);
    writeStorage(STORAGE_KEYS.ORDERS, orders);
    writeStorage(STORAGE_KEYS.TICKETS, [...createdTickets, ...currentTickets]);

    // Update current draw pool
    const currentDraw = this.getCurrentDraw();
    const addedAmount = newOrder.total_amount;
    const newPool = currentDraw.total_pool_amount + addedAmount;
    const newSold = currentDraw.total_tickets_sold + newOrder.quantity;

    currentDraw.total_pool_amount = newPool;
    currentDraw.total_tickets_sold = newSold;
    currentDraw.first_prize_pool = Math.round(newPool * 0.15);
    currentDraw.second_prize_pool = Math.round(newPool * 0.15);
    currentDraw.third_prize_pool = Math.round(newPool * 0.20);
    currentDraw.company_share = Math.round(newPool * 0.50);

    writeStorage(STORAGE_KEYS.CURRENT_DRAW, currentDraw);

    return {
      success: true,
      message: `Direct payment verified! ${createdTickets.length} ticket(s) minted immediately.`,
      order: newOrder,
      ticketsCreated: createdTickets,
    };
  }

  // Admin approves order -> generates unique ticket numbers and enters into active draw
  static approveOrder(orderId: string): { success: boolean; message: string; ticketsCreated?: Ticket[] } {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return { success: false, message: 'Order not found.' };
    }

    const order = orders[orderIndex];
    if (order.status === 'approved') {
      return { success: false, message: 'Order is already approved.' };
    }

    const currentTickets = this.getTickets();
    const existingTicketNumbers = new Set(currentTickets.map(t => t.ticket_number));
    const createdTickets: Ticket[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < order.quantity; i++) {
      let uniqueNum = '';
      while (true) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        uniqueNum = `BN-${currentYear}-${rand}`;
        if (!existingTicketNumbers.has(uniqueNum)) {
          existingTicketNumbers.add(uniqueNum);
          break;
        }
      }

      const ticket: Ticket = {
        id: `tkt-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
        ticket_number: uniqueNum,
        order_id: order.id,
        user_id: order.user_id,
        draw_id: order.draw_id,
        is_winner: false,
        prize_amount: 0,
        status: 'valid',
        created_at: new Date().toISOString(),
        buyer_name: order.user_name,
        buyer_phone: order.user_phone,
      };
      createdTickets.push(ticket);
    }

    // Save tickets
    const updatedTickets = [...createdTickets, ...currentTickets];
    writeStorage(STORAGE_KEYS.TICKETS, updatedTickets);

    // Update order status
    order.status = 'approved';
    order.reviewed_at = new Date().toISOString();
    writeStorage(STORAGE_KEYS.ORDERS, orders);

    // Update current draw pool
    const currentDraw = this.getCurrentDraw();
    const addedAmount = order.total_amount;
    const newPool = currentDraw.total_pool_amount + addedAmount;
    const newSold = currentDraw.total_tickets_sold + order.quantity;

    currentDraw.total_pool_amount = newPool;
    currentDraw.total_tickets_sold = newSold;
    currentDraw.first_prize_pool = Math.round(newPool * 0.15);
    currentDraw.second_prize_pool = Math.round(newPool * 0.15);
    currentDraw.third_prize_pool = Math.round(newPool * 0.20);
    currentDraw.company_share = Math.round(newPool * 0.50);

    writeStorage(STORAGE_KEYS.CURRENT_DRAW, currentDraw);

    return { success: true, message: `Approved order. ${createdTickets.length} unique ticket(s) generated.`, ticketsCreated: createdTickets };
  }

  // Admin rejects order
  static rejectOrder(orderId: string, reason: string): { success: boolean; message: string } {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    order.status = 'rejected';
    order.rejection_reason = reason || 'Payment not received or invalid Transaction ID.';
    order.reviewed_at = new Date().toISOString();

    writeStorage(STORAGE_KEYS.ORDERS, orders);
    return { success: true, message: 'Order rejected.' };
  }

  // Tickets
  static getTickets(): Ticket[] {
    return readStorage<Ticket[]>(STORAGE_KEYS.TICKETS, []);
  }

  static getUserTickets(userId: string): Ticket[] {
    return this.getTickets().filter(t => t.user_id === userId);
  }

  // Winners
  static getWinners(): DrawWinner[] {
    return readStorage<DrawWinner[]>(STORAGE_KEYS.WINNERS, INITIAL_WINNERS);
  }

  // Execute Draw (Random or Manual)
  static executeDraw(manualTicketNumbers?: { first?: string[]; second?: string[]; third?: string[] }): {
    success: boolean;
    message: string;
    completedDraw?: Draw;
    winners?: DrawWinner[];
  } {
    const currentDraw = this.getCurrentDraw();
    const allTickets = this.getTickets();
    const activeValidTickets = allTickets.filter(t => t.draw_id === currentDraw.id && t.status === 'valid');

    if (activeValidTickets.length === 0 && !manualTicketNumbers) {
      return { success: false, message: 'Cannot execute draw: No approved tickets available in the current draw pool.' };
    }

    const pool = currentDraw.total_pool_amount;
    const firstPrize = Math.round(pool * 0.15); // 1 winner
    const secondPrizeEach = Math.round((pool * 0.15) / 2); // 2 winners (7.5% each)
    const thirdPrizeEach = Math.round((pool * 0.20) / 5); // 5 winners (4% each)

    const newWinners: DrawWinner[] = [];
    const winningTicketNumbers: { first: string[]; second: string[]; third: string[] } = {
      first: [],
      second: [],
      third: [],
    };

    // Helper for manual or random selection
    const availablePool = [...activeValidTickets];
    const pickRandomTicket = (): Ticket | undefined => {
      if (availablePool.length === 0) return undefined;
      const index = Math.floor(Math.random() * availablePool.length);
      return availablePool.splice(index, 1)[0];
    };

    // 1st Prize: 1 winner
    if (manualTicketNumbers?.first?.length) {
      manualTicketNumbers.first.forEach(num => {
        const tkt = allTickets.find(t => t.ticket_number === num) || {
          id: `manual-1`,
          ticket_number: num,
          order_id: '',
          user_id: 'manual',
          draw_id: currentDraw.id,
          is_winner: true,
          prize_amount: firstPrize,
          status: 'valid' as const,
          created_at: new Date().toISOString(),
          buyer_name: 'Verified Winner',
          buyer_phone: '01712*****',
        };
        winningTicketNumbers.first.push(num);
        newWinners.push({
          id: `win-${Date.now()}-1`,
          draw_id: currentDraw.id,
          draw_number: currentDraw.draw_number,
          ticket_id: tkt.id,
          ticket_number: tkt.ticket_number,
          user_id: tkt.user_id,
          prize_tier: '1st',
          prize_amount: firstPrize,
          masked_phone: maskPhone(tkt.buyer_phone || '0171200000'),
          masked_email: 'wi***@bignosib.com',
          full_name: tkt.buyer_name || 'Jackpot Winner',
          announced_at: new Date().toISOString(),
        });
      });
    } else {
      const picked = pickRandomTicket();
      if (picked) {
        picked.is_winner = true;
        picked.prize_tier = '1st';
        picked.prize_amount = firstPrize;
        winningTicketNumbers.first.push(picked.ticket_number);
        newWinners.push({
          id: `win-${Date.now()}-1`,
          draw_id: currentDraw.id,
          draw_number: currentDraw.draw_number,
          ticket_id: picked.id,
          ticket_number: picked.ticket_number,
          user_id: picked.user_id,
          prize_tier: '1st',
          prize_amount: firstPrize,
          masked_phone: maskPhone(picked.buyer_phone || '0171200000'),
          masked_email: 'wi***@bignosib.com',
          full_name: picked.buyer_name || 'Champion Player',
          announced_at: new Date().toISOString(),
        });
      }
    }

    // 2nd Prize: 2 winners
    for (let i = 0; i < 2; i++) {
      const manualNum = manualTicketNumbers?.second?.[i];
      if (manualNum) {
        winningTicketNumbers.second.push(manualNum);
        newWinners.push({
          id: `win-${Date.now()}-2-${i}`,
          draw_id: currentDraw.id,
          draw_number: currentDraw.draw_number,
          ticket_id: `man-2-${i}`,
          ticket_number: manualNum,
          user_id: 'manual',
          prize_tier: '2nd',
          prize_amount: secondPrizeEach,
          masked_phone: '01819*****',
          masked_email: 'wi***@bignosib.com',
          full_name: 'Silver Winner',
          announced_at: new Date().toISOString(),
        });
      } else {
        const picked = pickRandomTicket();
        if (picked) {
          picked.is_winner = true;
          picked.prize_tier = '2nd';
          picked.prize_amount = secondPrizeEach;
          winningTicketNumbers.second.push(picked.ticket_number);
          newWinners.push({
            id: `win-${Date.now()}-2-${i}`,
            draw_id: currentDraw.id,
            draw_number: currentDraw.draw_number,
            ticket_id: picked.id,
            ticket_number: picked.ticket_number,
            user_id: picked.user_id,
            prize_tier: '2nd',
            prize_amount: secondPrizeEach,
            masked_phone: maskPhone(picked.buyer_phone || '0181900000'),
            masked_email: 'wi***@bignosib.com',
            full_name: picked.buyer_name || 'Lucky Participant',
            announced_at: new Date().toISOString(),
          });
        }
      }
    }

    // 3rd Prize: 5 winners
    for (let i = 0; i < 5; i++) {
      const manualNum = manualTicketNumbers?.third?.[i];
      if (manualNum) {
        winningTicketNumbers.third.push(manualNum);
        newWinners.push({
          id: `win-${Date.now()}-3-${i}`,
          draw_id: currentDraw.id,
          draw_number: currentDraw.draw_number,
          ticket_id: `man-3-${i}`,
          ticket_number: manualNum,
          user_id: 'manual',
          prize_tier: '3rd',
          prize_amount: thirdPrizeEach,
          masked_phone: '01911*****',
          masked_email: 'wi***@bignosib.com',
          full_name: 'Bronze Winner',
          announced_at: new Date().toISOString(),
        });
      } else {
        const picked = pickRandomTicket();
        if (picked) {
          picked.is_winner = true;
          picked.prize_tier = '3rd';
          picked.prize_amount = thirdPrizeEach;
          winningTicketNumbers.third.push(picked.ticket_number);
          newWinners.push({
            id: `win-${Date.now()}-3-${i}`,
            draw_id: currentDraw.id,
            draw_number: currentDraw.draw_number,
            ticket_id: picked.id,
            ticket_number: picked.ticket_number,
            user_id: picked.user_id,
            prize_tier: '3rd',
            prize_amount: thirdPrizeEach,
            masked_phone: maskPhone(picked.buyer_phone || '0191100000'),
            masked_email: 'wi***@bignosib.com',
            full_name: picked.buyer_name || 'Bronze Participant',
            announced_at: new Date().toISOString(),
          });
        }
      }
    }

    // Expire all tickets of current draw so they cannot be reused in future draws
    allTickets.forEach(t => {
      if (t.draw_id === currentDraw.id) {
        t.status = 'expired';
      }
    });
    writeStorage(STORAGE_KEYS.TICKETS, allTickets);

    // Save winners
    const allWinners = [...newWinners, ...this.getWinners()];
    writeStorage(STORAGE_KEYS.WINNERS, allWinners);

    // Complete the current draw and move to past draws
    const completedDraw: Draw = {
      ...currentDraw,
      status: 'completed',
      completed_at: new Date().toISOString(),
      winning_tickets: winningTicketNumbers,
    };

    const pastDraws = [completedDraw, ...this.getPastDraws()];
    writeStorage(STORAGE_KEYS.PAST_DRAWS, pastDraws);

    // Initialize next active draw
    const nextDrawNum = currentDraw.draw_number + 1;
    const nextDraw: Draw = {
      id: `draw-${nextDrawNum}`,
      draw_number: nextDrawNum,
      title: `Weekly Mega Jackpot Draw #${nextDrawNum}`,
      draw_date: getNextDrawDate(),
      total_tickets_sold: 0,
      total_pool_amount: 0,
      first_prize_pool: 0,
      second_prize_pool: 0,
      third_prize_pool: 0,
      company_share: 0,
      status: 'active',
    };
    writeStorage(STORAGE_KEYS.CURRENT_DRAW, nextDraw);

    // Update settings next draw time
    this.updateSettings({ next_draw_time: nextDraw.draw_date });

    return {
      success: true,
      message: `Draw #${currentDraw.draw_number} completed successfully! ${newWinners.length} winners announced.`,
      completedDraw,
      winners: newWinners,
    };
  }

  // Financial Summary for Admin Reports
  static getFinancialSummary(): {
    totalTicketsAllTime: number;
    totalSalesAllTime: number;
    totalPrizesDistributed: number;
    totalCompanyRevenue: number;
    activeDrawSales: number;
    activeDrawCompanyReserve: number;
    pendingOrdersCount: number;
  } {
    const past = this.getPastDraws();
    const curr = this.getCurrentDraw();
    const orders = this.getOrders();

    const pastSales = past.reduce((acc, d) => acc + (d.total_pool_amount || 0), 0);
    const pastTickets = past.reduce((acc, d) => acc + (d.total_tickets_sold || 0), 0);
    const pastPrizes = past.reduce(
      (acc, d) => acc + (d.first_prize_pool + d.second_prize_pool + d.third_prize_pool || 0),
      0
    );
    const pastCompany = past.reduce((acc, d) => acc + (d.company_share || 0), 0);

    const pendingCount = orders.filter(o => o.status === 'pending').length;

    return {
      totalTicketsAllTime: pastTickets + curr.total_tickets_sold,
      totalSalesAllTime: pastSales + curr.total_pool_amount,
      totalPrizesDistributed: pastPrizes,
      totalCompanyRevenue: pastCompany + curr.company_share,
      activeDrawSales: curr.total_pool_amount,
      activeDrawCompanyReserve: curr.company_share,
      pendingOrdersCount: pendingCount,
    };
  }
}
