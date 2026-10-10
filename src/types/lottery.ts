export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  phone: string;
  email: string;
  username: string;
  full_name: string;
  country: string;
  address: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'usdt';
export type OrderStatus = 'pending' | 'approved' | 'rejected';
export type DrawStatus = 'active' | 'drawing' | 'completed';
export type PrizeTier = '1st' | '2nd' | '3rd';

export interface SystemSettings {
  ticket_price: number;
  extra_charge_name: string;
  extra_charge_amount: number;
  bkash_number: string;
  bkash_type: string;
  nagad_number: string;
  nagad_type: string;
  usdt_address: string;
  usdt_network: string;
  next_draw_time: string;
  draw_frequency: string;
  banner_announcement: string;
}

export interface Draw {
  id: string;
  draw_number: number;
  title: string;
  draw_date: string;
  total_tickets_sold: number;
  total_pool_amount: number;
  first_prize_pool: number; // 15%
  second_prize_pool: number; // 15% (7.5% each for 2 winners)
  third_prize_pool: number; // 20% (4% each for 5 winners)
  company_share: number; // 50% (Visible only in admin panel)
  status: DrawStatus;
  completed_at?: string;
  winning_tickets?: {
    first: string[];
    second: string[];
    third: string[];
  };
}

export interface TicketOrder {
  id: string;
  user_id: string;
  draw_id: string;
  quantity: number;
  unit_price: number;
  extra_charge: number;
  total_amount: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  sender_number: string;
  status: OrderStatus;
  rejection_reason?: string;
  reviewed_at?: string;
  created_at: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
}

export interface Ticket {
  id: string;
  ticket_number: string; // e.g. "BN-2026-89412"
  order_id: string;
  user_id: string;
  draw_id: string;
  is_winner: boolean;
  prize_tier?: PrizeTier | null;
  prize_amount: number;
  status: 'valid' | 'expired';
  created_at: string;
  buyer_name?: string;
  buyer_phone?: string;
}

export interface DrawWinner {
  id: string;
  draw_id: string;
  draw_number: number;
  ticket_id: string;
  ticket_number: string;
  user_id: string;
  prize_tier: PrizeTier;
  prize_amount: number;
  masked_phone: string; // e.g. "01712*****"
  masked_email: string; // e.g. "sk***@gmail.com"
  full_name: string;
  avatar_url?: string;
  announced_at: string;
}
