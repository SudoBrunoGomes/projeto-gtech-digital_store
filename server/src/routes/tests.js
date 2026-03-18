import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.send(TEST_PAGE_HTML);
});

const TEST_PAGE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gtech Store - Test Runner</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      min-height: 100vh;
    }

    .header {
      background: #161b22;
      border-bottom: 1px solid #30363d;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      color: #f0f6fc;
    }

    .header h1 span {
      color: #7ee787;
    }

    .badge {
      background: #30363d;
      color: #8b949e;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .btn {
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background: #238636;
      color: #fff;
    }

    .btn-primary:hover { background: #2ea043; }
    .btn-primary:disabled { background: #1a5a28; opacity: 0.7; cursor: not-allowed; }

    .btn-secondary {
      background: #21262d;
      color: #c9d1d9;
      border: 1px solid #30363d;
    }

    .btn-secondary:hover { background: #30363d; }

    .btn-link {
      background: transparent;
      color: #58a6ff;
      border: 1px solid #30363d;
    }

    .btn-link:hover { background: #161b22; }

    .stats-bar {
      background: #161b22;
      border-bottom: 1px solid #30363d;
      padding: 12px 24px;
      display: flex;
      gap: 24px;
      font-size: 13px;
      flex-wrap: wrap;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .stat-dot.green { background: #3fb950; }
    .stat-dot.red { background: #f85149; }
    .stat-dot.yellow { background: #d29922; }
    .stat-dot.blue { background: #58a6ff; }
    .stat-dot.gray { background: #484f58; }

    .progress-container {
      padding: 0 24px;
      background: #161b22;
      border-bottom: 1px solid #30363d;
    }

    .progress-bar {
      height: 3px;
      background: #21262d;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #3fb950;
      width: 0%;
      transition: width 0.3s ease;
    }

    .progress-fill.has-failures { background: #f85149; }

    .terminal {
      margin: 16px 24px;
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 8px;
      overflow: hidden;
    }

    .terminal-header {
      background: #161b22;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #30363d;
    }

    .terminal-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .terminal-dot.r { background: #f85149; }
    .terminal-dot.y { background: #d29922; }
    .terminal-dot.g { background: #3fb950; }

    .terminal-title {
      font-size: 12px;
      color: #8b949e;
      margin-left: 8px;
    }

    .terminal-body {
      padding: 16px;
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.6;
      max-height: 65vh;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .terminal-body::-webkit-scrollbar { width: 8px; }
    .terminal-body::-webkit-scrollbar-track { background: #0d1117; }
    .terminal-body::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }

    .line { padding: 1px 0; }
    .pass { color: #3fb950; }
    .fail { color: #f85149; }
    .skip { color: #d29922; }
    .dim { color: #484f58; }
    .bold { font-weight: 700; }
    .suite { color: #f0f6fc; font-weight: 700; }
    .time { color: #8b949e; }
    .info { color: #58a6ff; }
    .separator { color: #30363d; }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #30363d;
      border-top-color: #3fb950;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .idle-message {
      color: #484f58;
      text-align: center;
      padding: 60px 20px;
      font-size: 14px;
    }

    .idle-message kbd {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 12px;
    }
  </style>
</head>
<body>

<div class="header">
  <div class="header-left">
    <h1><span>&#9679;</span> Gtech Store <span>Test Runner</span></h1>
    <span class="badge" id="statusBadge">Pronto</span>
  </div>
  <div class="header-actions">
    <button class="btn btn-link" onclick="window.location.href='/api/docs'">Swagger Docs</button>
    <button class="btn btn-secondary" onclick="clearTerminal()" id="btnClear">Limpar</button>
    <button class="btn btn-primary" onclick="runAllTests()" id="btnRun">&#9654; Executar Testes</button>
  </div>
</div>

<div class="stats-bar" id="statsBar">
  <div class="stat"><span class="stat-dot blue"></span> <span id="statTotal">0</span> testes</div>
  <div class="stat"><span class="stat-dot green"></span> <span id="statPassed">0</span> passou</div>
  <div class="stat"><span class="stat-dot red"></span> <span id="statFailed">0</span> falhou</div>
  <div class="stat"><span class="stat-dot gray"></span> <span id="statTime">0.00s</span></div>
</div>

<div class="progress-container">
  <div class="progress-bar">
    <div class="progress-fill" id="progressFill"></div>
  </div>
</div>

<div class="terminal">
  <div class="terminal-header">
    <span class="terminal-dot r"></span>
    <span class="terminal-dot y"></span>
    <span class="terminal-dot g"></span>
    <span class="terminal-title">test-runner &mdash; bash</span>
  </div>
  <div class="terminal-body" id="terminal">
    <div class="idle-message">
      Clique em <kbd>Executar Testes</kbd> para iniciar a suite de testes.<br><br>
      Os testes serao executados contra a API em <span class="info">http://localhost:4000/api</span>
    </div>
  </div>
</div>

<script>
const API = window.location.origin + '/api';
const T = document.getElementById('terminal');
const btnRun = document.getElementById('btnRun');
const btnClear = document.getElementById('btnClear');

let stats = { total: 0, passed: 0, failed: 0, startTime: 0 };
let adminToken = '';
let testUserToken = '';
let totalTests = 0;
let completedTests = 0;
let hasFailures = false;

function log(html) {
  const div = document.createElement('div');
  div.className = 'line';
  div.innerHTML = html;
  T.appendChild(div);
  T.scrollTop = T.scrollHeight;
}

function logSuite(name) {
  log('<br><span class="suite">' + esc(name) + '</span>');
}

function logPass(name, ms) {
  stats.passed++;
  stats.total++;
  completedTests++;
  updateProgress();
  log('  <span class="pass">\\u2713</span> <span class="dim">' + esc(name) + '</span> <span class="time">(' + ms + ' ms)</span>');
}

function logFail(name, ms, error) {
  stats.failed++;
  stats.total++;
  completedTests++;
  hasFailures = true;
  updateProgress();
  log('  <span class="fail">\\u2717 ' + esc(name) + '</span> <span class="time">(' + ms + ' ms)</span>');
  log('    <span class="fail">\\u2514 ' + esc(error) + '</span>');
}

function updateStats() {
  document.getElementById('statTotal').textContent = stats.total;
  document.getElementById('statPassed').textContent = stats.passed;
  document.getElementById('statFailed').textContent = stats.failed;
  const elapsed = ((performance.now() - stats.startTime) / 1000).toFixed(2);
  document.getElementById('statTime').textContent = elapsed + 's';
}

function updateProgress() {
  updateStats();
  const pct = totalTests > 0 ? (completedTests / totalTests * 100) : 0;
  const fill = document.getElementById('progressFill');
  fill.style.width = pct + '%';
  if (hasFailures) fill.classList.add('has-failures');
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function clearTerminal() {
  T.innerHTML = '<div class="idle-message">Terminal limpo. Clique em <kbd>Executar Testes</kbd> para rodar novamente.</div>';
  stats = { total: 0, passed: 0, failed: 0, startTime: 0 };
  completedTests = 0;
  hasFailures = false;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressFill').classList.remove('has-failures');
  updateStats();
  document.getElementById('statusBadge').textContent = 'Pronto';
}

async function apiFetch(path, opts = {}) {
  return fetch(API + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
}

async function authFetch(token, path, opts = {}) {
  return apiFetch(path, {
    ...opts,
    headers: { 'Authorization': 'Bearer ' + token, ...(opts.headers || {}) },
  });
}

async function runTest(name, fn) {
  const t0 = performance.now();
  try {
    await fn();
    const ms = Math.round(performance.now() - t0);
    logPass(name, ms);
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    logFail(name, ms, e.message);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

function assertEq(a, b, msg) {
  if (a !== b) throw new Error(msg || 'Expected ' + JSON.stringify(b) + ' but got ' + JSON.stringify(a));
}

function assertIncludes(arr, val, msg) {
  if (!arr.includes(val)) throw new Error(msg || JSON.stringify(val) + ' not found in array');
}

// ==================== TEST SUITES ====================

async function runAllTests() {
  T.innerHTML = '';
  stats = { total: 0, passed: 0, failed: 0, startTime: performance.now() };
  completedTests = 0;
  totalTests = 78;
  hasFailures = false;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressFill').classList.remove('has-failures');
  btnRun.disabled = true;
  btnRun.innerHTML = '<span class="spinner"></span> Executando...';
  document.getElementById('statusBadge').textContent = 'Executando...';

  log('<span class="info bold">GTECH STORE - Test Runner</span>');
  log('<span class="dim">Executando testes contra ' + API + '</span>');
  log('<span class="separator">' + '\\u2500'.repeat(55) + '</span>');

  const ts = Date.now();
  const testEmail = 'test_' + ts + '@example.com';
  const testEmail2 = 'test2_' + ts + '@example.com';
  let createdProductId, secondProductId, createdCouponId, createdSlideId, createdOrderId, orderMultiId;
  const couponCode = 'JEST_' + ts;

  // ---- AUTH: LOGIN ----
  logSuite('Auth - POST /auth/login');

  await runTest('deve rejeitar sem body', async () => {
    const r = await apiFetch('/auth/login', { method: 'POST', body: '{}' });
    assertEq(r.status, 400);
    const d = await r.json();
    assert(d.error && /obrigat/i.test(d.error), 'Mensagem de erro esperada');
  });

  await runTest('deve rejeitar sem password', async () => {
    const r = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@digitalstore.com' }) });
    assertEq(r.status, 400);
  });

  await runTest('deve rejeitar sem email', async () => {
    const r = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ password: 'admin123' }) });
    assertEq(r.status, 400);
  });

  await runTest('deve rejeitar email inexistente', async () => {
    const r = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'naoexiste@x.com', password: 'err' }) });
    assertEq(r.status, 401);
  });

  await runTest('deve rejeitar senha incorreta', async () => {
    const r = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@digitalstore.com', password: 'errada' }) });
    assertEq(r.status, 401);
  });

  await runTest('deve autenticar admin com sucesso', async () => {
    const r = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@digitalstore.com', password: 'admin123' }) });
    assertEq(r.status, 200);
    const d = await r.json();
    assert(d.token, 'Token ausente');
    assertEq(d.token.split('.').length, 3, 'JWT deve ter 3 partes');
    assertEq(d.user.role, 'admin');
    assertEq(d.user.email, 'admin@digitalstore.com');
    assert(!d.user.password, 'Senha nao deve ser exposta');
    adminToken = d.token;
  });

  // ---- AUTH: SIGNUP ----
  logSuite('Auth - POST /auth/signup');

  await runTest('deve rejeitar sem email', async () => {
    const r = await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ password: '123456' }) });
    assertEq(r.status, 400);
  });

  await runTest('deve rejeitar sem senha', async () => {
    const r = await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ email: 'novo@t.com' }) });
    assertEq(r.status, 400);
  });

  await runTest('deve criar usuario com todos os campos', async () => {
    const r = await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ email: testEmail, password: 'teste123', name: 'Teste Auto', birthdate: '1990-05-15' }) });
    assertEq(r.status, 201);
    const d = await r.json();
    assert(d.token, 'Token ausente');
    assertEq(d.user.email, testEmail);
    assertEq(d.user.role, 'user');
    testUserToken = d.token;
  });

  await runTest('deve criar usuario sem nome', async () => {
    const r = await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ email: testEmail2, password: 'teste123' }) });
    assertEq(r.status, 201);
    const d = await r.json();
    assert(d.user.name && d.user.name.length > 0, 'Nome deve ser gerado');
  });

  await runTest('deve rejeitar email duplicado', async () => {
    const r = await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ email: testEmail, password: 'teste123' }) });
    assertEq(r.status, 400);
    const d = await r.json();
    assert(/cadastrado/i.test(d.error), 'Erro de duplicidade esperado');
  });

  // ---- AUTH: ME ----
  logSuite('Auth - GET /auth/me');

  await runTest('deve retornar dados do admin', async () => {
    const r = await authFetch(adminToken, '/auth/me');
    assertEq(r.status, 200);
    const d = await r.json();
    assertEq(d.user.email, 'admin@digitalstore.com');
    assertEq(d.user.role, 'admin');
    assert(!d.user.password, 'Senha nao deve ser exposta');
  });

  await runTest('deve retornar dados do usuario comum', async () => {
    const r = await authFetch(testUserToken, '/auth/me');
    assertEq(r.status, 200);
    const d = await r.json();
    assertEq(d.user.email, testEmail);
    assertEq(d.user.role, 'user');
  });

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/auth/me');
    assertEq(r.status, 401);
  });

  await runTest('deve rejeitar token invalido', async () => {
    const r = await authFetch('token.invalido.fake', '/auth/me');
    assertEq(r.status, 401);
  });

  await runTest('deve rejeitar sem prefixo Bearer', async () => {
    const r = await apiFetch('/auth/me', { headers: { 'Authorization': adminToken } });
    assertEq(r.status, 401);
  });

  // ---- PRODUCTS: GET ----
  logSuite('Products - GET /products (publico)');

  await runTest('deve listar produtos sem autenticacao', async () => {
    const r = await apiFetch('/products');
    assertEq(r.status, 200);
    const d = await r.json();
    assert(Array.isArray(d), 'Resposta deve ser array');
    assert(d.length >= 1, 'Seed deve ter produtos');
  });

  await runTest('deve retornar estrutura correta', async () => {
    const r = await apiFetch('/products');
    const d = await r.json();
    const p = d[0];
    assert(p.id !== undefined, 'id ausente');
    assert(p.name, 'name ausente');
    assert(p.category, 'category ausente');
    assert(p.price !== undefined, 'price ausente');
    assert(p.image, 'image ausente');
    assert(Array.isArray(p.images), 'images deve ser array');
    assert(Array.isArray(p.available_sizes), 'available_sizes deve ser array');
  });

  // ---- PRODUCTS: POST ----
  logSuite('Products - POST /products (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/products', { method: 'POST', body: JSON.stringify({ name: 'Teste' }) });
    assertEq(r.status, 401);
  });

  await runTest('deve criar produto completo', async () => {
    const r = await authFetch(adminToken, '/products', { method: 'POST', body: JSON.stringify({
      name: 'Produto Teste Runner', category: 'Tenis', price: 199.90, original_price: 299.90,
      discount: '33% OFF', image: 'https://ex.com/img.jpg', images: ['https://ex.com/2.jpg', 'https://ex.com/3.jpg'],
      description: 'Criado pelo test runner', available_sizes: ['39','40','41'], stock: 10
    })});
    assertEq(r.status, 201);
    const d = await r.json();
    assert(d.id, 'ID ausente');
    createdProductId = d.id;
  });

  await runTest('deve criar produto com campos minimos', async () => {
    const r = await authFetch(adminToken, '/products', { method: 'POST', body: JSON.stringify({
      name: 'Produto Minimo', category: 'Outros', price: 50, original_price: 50, image: 'https://ex.com/min.jpg'
    })});
    assertEq(r.status, 201);
    secondProductId = (await r.json()).id;
  });

  await runTest('produto criado deve aparecer na listagem', async () => {
    const r = await apiFetch('/products');
    const d = await r.json();
    const found = d.find(p => p.id === createdProductId);
    assert(found, 'Produto nao encontrado na listagem');
    assertEq(found.name, 'Produto Teste Runner');
    assert(found.images.length === 2, 'Deve ter 2 imagens');
  });

  await runTest('usuario comum pode criar produto', async () => {
    const r = await authFetch(testUserToken, '/products', { method: 'POST', body: JSON.stringify({
      name: 'User Comum Prod', category: 'Tenis', price: 99, original_price: 99, image: 'https://ex.com/u.jpg'
    })});
    assert([201, 403].includes(r.status), 'Status inesperado: ' + r.status);
    if (r.status === 201) { const d = await r.json(); await authFetch(adminToken, '/products/' + d.id, { method: 'DELETE' }); }
  });

  // ---- PRODUCTS: PUT ----
  logSuite('Products - PUT /products/:id (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/products/' + createdProductId, { method: 'PUT', body: JSON.stringify({ name: 'Hack' }) });
    assertEq(r.status, 401);
  });

  await runTest('deve atualizar produto', async () => {
    const r = await authFetch(adminToken, '/products/' + createdProductId, { method: 'PUT', body: JSON.stringify({
      name: 'Atualizado Runner', category: 'Tenis', price: 149.90, original_price: 299.90,
      discount: '50% OFF', image: 'https://ex.com/up.jpg', images: [], description: 'Atualizado',
      available_sizes: ['42','43'], stock: 5
    })});
    assertEq(r.status, 200);
  });

  await runTest('atualizacao deve persistir', async () => {
    const r = await apiFetch('/products');
    const d = await r.json();
    const found = d.find(p => p.id === createdProductId);
    assert(found, 'Produto nao encontrado');
    assertEq(found.name, 'Atualizado Runner');
    assertEq(found.discount, '50% OFF');
  });

  // ---- PRODUCTS: DELETE ----
  logSuite('Products - DELETE /products/:id (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/products/' + createdProductId, { method: 'DELETE' });
    assertEq(r.status, 401);
  });

  await runTest('deve deletar produto', async () => {
    const r = await authFetch(adminToken, '/products/' + createdProductId, { method: 'DELETE' });
    assertEq(r.status, 200);
  });

  await runTest('produto deletado nao deve aparecer', async () => {
    const r = await apiFetch('/products');
    const d = await r.json();
    assert(!d.find(p => p.id === createdProductId), 'Produto ainda presente');
  });

  await runTest('deve deletar segundo produto', async () => {
    const r = await authFetch(adminToken, '/products/' + secondProductId, { method: 'DELETE' });
    assertEq(r.status, 200);
  });

  // ---- COUPONS: GET ----
  logSuite('Coupons - GET /coupons (publico)');

  await runTest('deve listar cupons ativos', async () => {
    const r = await apiFetch('/coupons');
    assertEq(r.status, 200);
    const d = await r.json();
    assert(Array.isArray(d), 'Deve ser array');
  });

  await runTest('deve retornar estrutura correta', async () => {
    const r = await apiFetch('/coupons');
    const d = await r.json();
    if (d.length > 0) {
      const c = d[0];
      assert(c.code, 'code ausente');
      assert(c.discount_percent !== undefined, 'discount_percent ausente');
      assertIncludes(['product','shipping'], c.type, 'type invalido');
    }
  });

  await runTest('seed deve conter GTECH10 e FRETEGRATIS', async () => {
    const r = await apiFetch('/coupons');
    const d = await r.json();
    const codes = d.map(c => c.code);
    assertIncludes(codes, 'GTECH10');
    assertIncludes(codes, 'FRETEGRATIS');
  });

  // ---- COUPONS: POST ----
  logSuite('Coupons - POST /coupons (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/coupons', { method: 'POST', body: JSON.stringify({ code: 'HACK' }) });
    assertEq(r.status, 401);
  });

  await runTest('deve criar cupom tipo product', async () => {
    const r = await authFetch(adminToken, '/coupons', { method: 'POST', body: JSON.stringify({
      code: couponCode, discount_percent: 15, type: 'product', is_free_shipping: false, stackable: false
    })});
    assertEq(r.status, 201);
    createdCouponId = (await r.json()).id;
  });

  await runTest('cupom deve aparecer na listagem', async () => {
    const r = await apiFetch('/coupons');
    const d = await r.json();
    const found = d.find(c => c.code === couponCode);
    assert(found, 'Cupom nao encontrado');
    assertEq(parseFloat(found.discount_percent), 15);
  });

  await runTest('deve criar cupom tipo shipping', async () => {
    const r = await authFetch(adminToken, '/coupons', { method: 'POST', body: JSON.stringify({
      code: 'FRETE_' + ts, discount_percent: 100, type: 'shipping', is_free_shipping: true, stackable: true
    })});
    assertEq(r.status, 201);
    const d = await r.json();
    await authFetch(adminToken, '/coupons/' + d.id, { method: 'DELETE' });
  });

  // ---- COUPONS: DELETE ----
  logSuite('Coupons - DELETE /coupons/:id (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/coupons/' + createdCouponId, { method: 'DELETE' });
    assertEq(r.status, 401);
  });

  await runTest('deve deletar cupom', async () => {
    const r = await authFetch(adminToken, '/coupons/' + createdCouponId, { method: 'DELETE' });
    assertEq(r.status, 200);
  });

  await runTest('cupom deletado nao deve aparecer', async () => {
    const r = await apiFetch('/coupons');
    const d = await r.json();
    assert(!d.find(c => c.id === createdCouponId), 'Cupom ainda presente');
  });

  // ---- HERO SLIDES: GET ----
  logSuite('Hero Slides - GET /hero-slides (publico)');

  await runTest('deve listar slides ativos', async () => {
    const r = await apiFetch('/hero-slides');
    assertEq(r.status, 200);
    const d = await r.json();
    assert(Array.isArray(d) && d.length >= 1, 'Seed deve ter slides');
  });

  await runTest('deve retornar estrutura correta', async () => {
    const r = await apiFetch('/hero-slides');
    const d = await r.json();
    const s = d[0];
    assert(s.title, 'title ausente');
    assert(s.button_text, 'button_text ausente');
    assert(s.image, 'image ausente');
    assert(s.position !== undefined, 'position ausente');
  });

  await runTest('slides devem estar ordenados por position', async () => {
    const r = await apiFetch('/hero-slides');
    const d = await r.json();
    for (let i = 1; i < d.length; i++) assert(d[i].position >= d[i-1].position, 'Ordem incorreta');
  });

  // ---- HERO SLIDES: POST/PUT/DELETE ----
  logSuite('Hero Slides - CRUD (protegido)');

  await runTest('POST deve rejeitar sem token', async () => {
    const r = await apiFetch('/hero-slides', { method: 'POST', body: JSON.stringify({ title: 'x' }) });
    assertEq(r.status, 401);
  });

  await runTest('deve criar slide', async () => {
    const r = await authFetch(adminToken, '/hero-slides', { method: 'POST', body: JSON.stringify({
      tag: 'Teste', title: 'Slide Runner', description: 'Teste', button_text: 'Testar',
      button_link: '/test', image: 'https://ex.com/b.jpg', bg_color: 'bg-blue-500', bg_dark: 'dark:bg-blue-900', position: 99
    })});
    assertEq(r.status, 201);
    createdSlideId = (await r.json()).id;
  });

  await runTest('PUT deve rejeitar sem token', async () => {
    const r = await apiFetch('/hero-slides/' + createdSlideId, { method: 'PUT', body: '{}' });
    assertEq(r.status, 401);
  });

  await runTest('deve atualizar slide', async () => {
    const r = await authFetch(adminToken, '/hero-slides/' + createdSlideId, { method: 'PUT', body: JSON.stringify({
      tag: 'Upd', title: 'Atualizado', description: 'Upd', button_text: 'Comprar',
      button_link: '/p', image: 'https://ex.com/up.jpg', bg_color: 'bg-red-500', bg_dark: 'dark:bg-red-900'
    })});
    assertEq(r.status, 200);
  });

  await runTest('DELETE deve rejeitar sem token', async () => {
    const r = await apiFetch('/hero-slides/' + createdSlideId, { method: 'DELETE' });
    assertEq(r.status, 401);
  });

  await runTest('deve deletar slide', async () => {
    const r = await authFetch(adminToken, '/hero-slides/' + createdSlideId, { method: 'DELETE' });
    assertEq(r.status, 200);
  });

  // ---- ORDERS: GET ----
  logSuite('Orders - GET /orders (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/orders');
    assertEq(r.status, 401);
  });

  await runTest('deve rejeitar token invalido', async () => {
    const r = await authFetch('abc.def.ghi', '/orders');
    assertEq(r.status, 401);
  });

  await runTest('deve listar pedidos autenticado', async () => {
    const r = await authFetch(adminToken, '/orders');
    assertEq(r.status, 200);
    const d = await r.json();
    assert(Array.isArray(d), 'Deve ser array');
  });

  // ---- ORDERS: POST ----
  logSuite('Orders - POST /orders (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/orders', { method: 'POST', body: JSON.stringify({ customer_name: 'x' }) });
    assertEq(r.status, 401);
  });

  await runTest('deve criar pedido com 1 item', async () => {
    const r = await authFetch(adminToken, '/orders', { method: 'POST', body: JSON.stringify({
      user_id: 1, customer_name: 'Teste Runner', customer_email: 'runner@test.com', total: 199.90,
      subtotal: 199.90, status: 'pending', payment_method: 'PIX', shipping_address: 'Rua Teste, 123',
      shipping_cost: 0, discount: 0,
      items: [{ product_id: 1, name: 'K-Swiss V8', image: 'https://ex.com/i.jpg', quantity: 2, price: 99.95, size: '42', color: 'Preto' }]
    })});
    assertEq(r.status, 201);
    createdOrderId = (await r.json()).id;
  });

  await runTest('deve criar pedido com multiplos itens', async () => {
    const r = await authFetch(adminToken, '/orders', { method: 'POST', body: JSON.stringify({
      customer_name: 'Maria', customer_email: 'maria@e.com', total: 549, subtotal: 549,
      status: 'pending', payment_method: 'Cartao', shipping_address: 'Rua Flores, 456',
      shipping_cost: 15, discount: 10,
      items: [
        { product_id: 1, name: 'K-Swiss', image: 'https://ex.com/1.jpg', quantity: 1, price: 100, size: '40', color: 'Branco' },
        { product_id: 2, name: 'Nike Air', image: 'https://ex.com/2.jpg', quantity: 1, price: 449, size: '38', color: 'Azul' }
      ]
    })});
    assertEq(r.status, 201);
    orderMultiId = (await r.json()).id;
  });

  await runTest('deve criar pedido sem user_id (visitante)', async () => {
    const r = await authFetch(adminToken, '/orders', { method: 'POST', body: JSON.stringify({
      customer_name: 'Visitante', customer_email: 'v@e.com', total: 89, subtotal: 89,
      status: 'pending', payment_method: 'Boleto', shipping_address: 'Rua S/N',
      items: [{ product_id: 3, name: 'Camiseta', image: 'https://ex.com/3.jpg', quantity: 1, price: 89, size: 'GG', color: 'Preto' }]
    })});
    assertEq(r.status, 201);
  });

  await runTest('pedido deve incluir order_items', async () => {
    const r = await authFetch(adminToken, '/orders');
    const d = await r.json();
    const o = d.find(x => x.id === orderMultiId);
    assert(o, 'Pedido nao encontrado');
    assert(Array.isArray(o.order_items), 'order_items deve ser array');
    assertEq(o.order_items.length, 2, 'Deve ter 2 itens');
  });

  await runTest('estrutura dos itens do pedido', async () => {
    const r = await authFetch(adminToken, '/orders');
    const d = await r.json();
    const o = d.find(x => x.id === orderMultiId);
    const item = o.order_items[0];
    assert(item.order_id === orderMultiId, 'order_id incorreto');
    assert(item.name, 'name ausente');
    assert(item.quantity, 'quantity ausente');
    assert(item.price !== undefined, 'price ausente');
  });

  // ---- ORDERS: PUT STATUS ----
  logSuite('Orders - PUT /orders/:id/status (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/orders/' + createdOrderId + '/status', { method: 'PUT', body: JSON.stringify({ status: 'shipped' }) });
    assertEq(r.status, 401);
  });

  await runTest('fluxo: pending -> processing', async () => {
    const r = await authFetch(adminToken, '/orders/' + createdOrderId + '/status', { method: 'PUT', body: JSON.stringify({ status: 'processing' }) });
    assertEq(r.status, 200);
  });

  await runTest('fluxo: processing -> shipped', async () => {
    const r = await authFetch(adminToken, '/orders/' + createdOrderId + '/status', { method: 'PUT', body: JSON.stringify({ status: 'shipped' }) });
    assertEq(r.status, 200);
  });

  await runTest('fluxo: shipped -> delivered', async () => {
    const r = await authFetch(adminToken, '/orders/' + createdOrderId + '/status', { method: 'PUT', body: JSON.stringify({ status: 'delivered' }) });
    assertEq(r.status, 200);
  });

  await runTest('fluxo: cancelar pedido', async () => {
    const r = await authFetch(adminToken, '/orders/' + orderMultiId + '/status', { method: 'PUT', body: JSON.stringify({ status: 'cancelled' }) });
    assertEq(r.status, 200);
  });

  await runTest('status atualizado deve persistir', async () => {
    const r = await authFetch(adminToken, '/orders');
    const d = await r.json();
    const o = d.find(x => x.id === createdOrderId);
    assertEq(o.status, 'delivered');
  });

  await runTest('estrutura completa do pedido', async () => {
    const r = await authFetch(adminToken, '/orders');
    const d = await r.json();
    const o = d.find(x => x.id === createdOrderId);
    assert(o.customer_name, 'customer_name ausente');
    assert(o.customer_email, 'customer_email ausente');
    assert(o.total !== undefined, 'total ausente');
    assert(o.payment_method, 'payment_method ausente');
    assert(o.shipping_address, 'shipping_address ausente');
    assert(o.created_at, 'created_at ausente');
    assert(o.updated_at, 'updated_at ausente');
  });

  // ---- USERS ----
  logSuite('Users - GET /users (protegido)');

  await runTest('deve rejeitar sem token', async () => {
    const r = await apiFetch('/users');
    assertEq(r.status, 401);
  });

  await runTest('deve rejeitar token invalido', async () => {
    const r = await authFetch('x.y.z', '/users');
    assertEq(r.status, 401);
  });

  await runTest('deve listar usuarios', async () => {
    const r = await authFetch(adminToken, '/users');
    assertEq(r.status, 200);
    const d = await r.json();
    assert(Array.isArray(d) && d.length >= 2, 'Deve ter admin + teste');
  });

  await runTest('estrutura correta de usuario', async () => {
    const r = await authFetch(adminToken, '/users');
    const d = await r.json();
    const u = d[0];
    assert(u.id, 'id ausente');
    assert(u.email, 'email ausente');
    assert(u.name, 'name ausente');
    assert(u.role, 'role ausente');
    assert(!u.password, 'Senha nao deve ser exposta');
  });

  await runTest('deve conter admin na lista', async () => {
    const r = await authFetch(adminToken, '/users');
    const d = await r.json();
    assert(d.find(u => u.email === 'admin@digitalstore.com'), 'Admin nao encontrado');
  });

  await runTest('deve conter usuario de teste', async () => {
    const r = await authFetch(adminToken, '/users');
    const d = await r.json();
    const u = d.find(x => x.email === testEmail);
    assert(u, 'Usuario teste nao encontrado');
    assertEq(u.role, 'user');
  });

  await runTest('usuario comum pode listar usuarios', async () => {
    const r = await authFetch(testUserToken, '/users');
    assertEq(r.status, 200);
  });

  // ---- SEGURANCA ----
  logSuite('Seguranca geral');

  await runTest('token falso deve ser rejeitado em rotas protegidas', async () => {
    const fake = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.invalidsig';
    for (const ep of ['/orders', '/users']) {
      const r = await authFetch(fake, ep);
      assertEq(r.status, 401, 'Falhou em ' + ep);
    }
  });

  await runTest('POST sem auth em todas as rotas protegidas', async () => {
    for (const ep of ['/products', '/coupons', '/hero-slides', '/orders']) {
      const r = await apiFetch(ep, { method: 'POST', body: '{}' });
      assertEq(r.status, 401, 'Falhou em POST ' + ep);
    }
  });

  await runTest('DELETE sem auth em rotas protegidas', async () => {
    for (const ep of ['/products/999', '/coupons/999', '/hero-slides/999']) {
      const r = await apiFetch(ep, { method: 'DELETE' });
      assertEq(r.status, 401, 'Falhou em DELETE ' + ep);
    }
  });

  await runTest('PUT sem auth em rotas protegidas', async () => {
    for (const ep of ['/products/999', '/hero-slides/999', '/orders/999/status']) {
      const r = await apiFetch(ep, { method: 'PUT', body: '{}' });
      assertEq(r.status, 401, 'Falhou em PUT ' + ep);
    }
  });

  // ---- SUMMARY ----
  const elapsed = ((performance.now() - stats.startTime) / 1000).toFixed(2);
  log('');
  log('<span class="separator">' + '\\u2500'.repeat(55) + '</span>');

  if (stats.failed === 0) {
    log('<span class="pass bold">Test Suites:  1 passed, 1 total</span>');
    log('<span class="pass bold">Tests:        ' + stats.passed + ' passed</span>, ' + stats.total + ' total');
  } else {
    log('<span class="fail bold">Test Suites:  1 failed, 1 total</span>');
    log('<span class="pass bold">Tests:        ' + stats.passed + ' passed</span>, <span class="fail bold">' + stats.failed + ' failed</span>, ' + stats.total + ' total');
  }
  log('<span class="time">Time:         ' + elapsed + 's</span>');
  log('');

  updateStats();
  btnRun.disabled = false;
  btnRun.innerHTML = '&#9654; Executar Testes';
  document.getElementById('statusBadge').textContent = stats.failed === 0 ? 'Tudo passou!' : stats.failed + ' falha(s)';
}
</script>

</body>
</html>`;

export default router;
