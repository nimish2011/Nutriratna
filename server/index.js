/** Express server: serves the API under /api and (in production) the built website from dist/. */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import publicRoutes from './routes-public.js';
import adminRoutes from './routes-admin.js';

const app = express();
app.set('trust proxy', 1); // correct client IPs (for rate limiting) behind Render/Railway/Nginx

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }),
);
app.use(express.json({ limit: '20kb' }));

app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '1h' }));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const bad = err.type === 'entity.parse.failed' || err.type === 'entity.too.large';
  if (!bad) console.error(err);
  res.status(bad ? 400 : 500).json({ error: bad ? 'Invalid request' : 'Server error' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`NutriRatna running on http://localhost:${port}`));
