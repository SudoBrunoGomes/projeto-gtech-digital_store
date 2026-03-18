import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import pool from './db.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import couponsRoutes from './routes/coupons.js';
import heroSlidesRoutes from './routes/heroSlides.js';
import ordersRoutes from './routes/orders.js';
import usersRoutes from './routes/users.js';
import testsRoutes from './routes/tests.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sem origin (curl, mobile, etc)
    if (!origin) return callback(null, true);
    // Permitir localhost (dev) e qualquer dominio Vercel
    if (origin.includes('localhost') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

// Swagger UI
const swaggerBannerJs = `
setTimeout(function(){
  var w = document.querySelector(".swagger-ui .scheme-container");
  if (w) {
    var b = document.createElement("div");
    b.className = "test-runner-banner";
    b.innerHTML = '<span><span class="tr-icon">\\ud83e\\uddea</span><b>Test Runner</b> \\u2014 Execute os 78 testes automatizados da API</span><a href="/api/tests" target="_blank">Abrir Test Runner</a>';
    w.parentNode.insertBefore(b, w.nextSibling);
  }
}, 500);
`;

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `.swagger-ui .topbar { display: none }
    .swagger-ui .test-runner-banner { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 12px 20px; margin: 0 auto; max-width: 1460px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; box-sizing: border-box; }
    .test-runner-banner span { color: #f0f6fc; font-size: 15px; }
    .test-runner-banner .tr-icon { font-size: 26px; vertical-align: middle; margin-right: 6px; }
    .test-runner-banner a { background: #238636; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .test-runner-banner a:hover { background: #2ea043; }`,
  customSiteTitle: 'Gtech Store API - Swagger',
  customJsStr: swaggerBannerJs,
}));

// Aguardar MySQL estar pronto (retry connection)
async function waitForDB(retries = 30, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await pool.getConnection();
      conn.release();
      console.log('Conectado ao MySQL!');
      return;
    } catch (err) {
      console.log(`Aguardando MySQL... tentativa ${i + 1}/${retries}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Nao foi possivel conectar ao MySQL');
}

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/hero-slides', heroSlidesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

app.use('/api/tests', testsRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Iniciar
waitForDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});
