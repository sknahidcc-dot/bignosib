import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Public Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      platform: 'BigNosib',
      timestamp: new Date().toISOString(),
    });
  });

  // Admin Server-Side Authentication Route
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'sknahid.cc';
    const adminPass = process.env.ADMIN_PASSWORD || 'Sknahid@652391';
    const adminEmail = process.env.ADMIN_EMAIL || 'sknahid.cc@gmail.com';

    if ((username === adminUser || username === adminEmail) && password === adminPass) {
      const token = `bn_admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      return res.json({
        success: true,
        token,
        admin: {
          username: adminUser,
          email: adminEmail,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid administrative credentials. Unauthorized access logged.',
    });
  });

  // Public lottery config
  app.get('/api/lottery/config', (_req, res) => {
    res.json({
      platform: 'BigNosib',
      ticketPrice: 50,
      currency: 'BDT (৳)',
      supportedPayments: ['bKash', 'Nagad', 'USDT (TRC20)'],
      prizeTiers: [
        { tier: '1st', winners: 1, sharePercent: 15 },
        { tier: '2nd', winners: 2, sharePercent: 15, perWinnerPercent: 7.5 },
        { tier: '3rd', winners: 5, sharePercent: 20, perWinnerPercent: 4.0 },
      ],
    });
  });

  // In development, hook Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`BigNosib Fullstack Server listening on port ${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
