import { UserProfile } from '../types/lottery';

const AUTH_USER_KEY = 'bignosib_session_user';
const USERS_REGISTRY_KEY = 'bignosib_registered_users';
const ADMIN_SESSION_KEY = 'bignosib_admin_session_token';

// Demo initial user for testing convenience
const INITIAL_DEMO_USERS: (UserProfile & { password: string })[] = [
  {
    id: 'user-demo-1',
    phone: '01712345678',
    email: 'player@bignosib.com',
    username: 'luckyplayer',
    full_name: 'Tanvir Ahmed',
    country: 'Bangladesh',
    address: 'House 14, Road 5, Dhanmondi, Dhaka-1205',
    role: 'user',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    password: 'password123',
  },
];

function getUsers(): (UserProfile & { password: string })[] {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_USERS;
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

function saveUsers(users: (UserProfile & { password: string })[]): void {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export class AuthService {
  // Current logged in user
  static getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // Register new user
  static register(data: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    address: string;
    password: string;
  }): { success: boolean; message: string; user?: UserProfile } {
    const users = getUsers();
    const cleanPhone = data.phone.trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    // Check phone uniqueness
    if (users.some(u => u.phone === cleanPhone)) {
      return { success: false, message: 'This phone number is already registered. Please log in.' };
    }

    // Check username uniqueness
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Username is already taken. Please choose another one.' };
    }

    // Check email uniqueness
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'This email is already registered.' };
    }

    const newUser: UserProfile & { password: string } = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      phone: cleanPhone,
      email: cleanEmail,
      username: cleanUsername,
      full_name: data.fullName.trim(),
      country: data.country || 'Bangladesh',
      address: data.address.trim(),
      role: 'user',
      created_at: new Date().toISOString(),
      password: data.password,
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...safeUser } = newUser;
    return { success: true, message: 'Registration successful! You can now log in.', user: safeUser };
  }

  // Login with phone + password
  static login(phone: string, password: string): { success: boolean; message: string; user?: UserProfile } {
    const users = getUsers();
    const cleanPhone = phone.trim();

    const matched = users.find(u => u.phone === cleanPhone && u.password === password);
    if (!matched) {
      return { success: false, message: 'Invalid phone number or password. Please try again.' };
    }

    const { password: _, ...safeUser } = matched;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return { success: true, message: 'Login successful!', user: safeUser };
  }

  // Logout
  static logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  }

  // Update profile
  static updateProfile(
    userId: string,
    updates: Partial<Pick<UserProfile, 'full_name' | 'email' | 'phone' | 'country' | 'address' | 'avatar_url'>>
  ): { success: boolean; message: string; user?: UserProfile } {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) {
      return { success: false, message: 'User not found.' };
    }

    // If changing phone or email, verify uniqueness
    if (updates.phone && updates.phone !== users[idx].phone) {
      if (users.some(u => u.phone === updates.phone && u.id !== userId)) {
        return { success: false, message: 'This phone number is already registered by another account.' };
      }
    }

    if (updates.email && updates.email !== users[idx].email) {
      if (users.some(u => u.email === updates.email && u.id !== userId)) {
        return { success: false, message: 'This email is already in use.' };
      }
    }

    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);

    const { password: _, ...safeUser } = users[idx];
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return { success: true, message: 'Profile updated successfully.', user: safeUser };
  }

  // Reset password via email
  static requestPasswordReset(email: string): { success: boolean; message: string; resetToken?: string } {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const matched = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matched) {
      return { success: false, message: 'No registered account found with this email address.' };
    }

    // Generate simulated secure reset token
    const token = `reset-${Date.now()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    return {
      success: true,
      message: `Password reset verification link sent to ${cleanEmail}. (Code: ${token})`,
      resetToken: token,
    };
  }

  static resetPassword(email: string, newPassword: string): { success: boolean; message: string } {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (idx === -1) {
      return { success: false, message: 'Account not found.' };
    }

    users[idx].password = newPassword;
    saveUsers(users);

    return { success: true, message: 'Password has been reset successfully. Please log in with your phone and new password.' };
  }

  // Admin authentication for /np/error
  static isAdminAuthenticated(): boolean {
    const token = localStorage.getItem(ADMIN_SESSION_KEY);
    return Boolean(token && token.startsWith('bn_admin_auth_'));
  }

  static adminLogin(usernameOrEmail: string, password: string): { success: boolean; message: string } {
    const targetUsername = 'sknahid.cc';
    const targetEmail = 'sknahid.cc@gmail.com';
    const targetPassword = 'Sknahid@652391';

    const input = usernameOrEmail.trim();
    const isUserMatch = input === targetUsername || input === targetEmail;
    const isPassMatch = password === targetPassword;

    if (isUserMatch && isPassMatch) {
      const sessionToken = `bn_admin_auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem(ADMIN_SESSION_KEY, sessionToken);
      return { success: true, message: 'Admin access granted.' };
    }

    return { success: false, message: 'Authentication failed. Access denied to secure control room.' };
  }

  static adminLogout(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
