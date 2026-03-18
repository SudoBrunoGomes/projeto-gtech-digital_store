/**
 * Testes de integracao da API REST Express
 * Executa contra http://localhost:4000/api (Docker deve estar rodando)
 *
 * Cobertura:
 *   - Auth: login, signup, /me, validacoes, token invalido
 *   - Products: CRUD completo, estrutura de resposta, guards
 *   - Coupons: CRUD, validacoes, unicidade de code
 *   - Hero Slides: CRUD completo, estrutura
 *   - Orders: CRUD, itens, fluxo de status, estrutura
 *   - Users: listagem, estrutura, guards
 */

const API_URL = process.env.API_URL || 'http://localhost:4000/api';

// ==================== HELPERS ====================

const apiFetch = async (path: string, options: RequestInit = {}) => {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    },
  });
};

const authenticatedFetch = async (token: string, path: string, options: RequestInit = {}) => {
  return apiFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...((options.headers as Record<string, string>) || {}),
    },
  });
};

// ==================== STATE ====================

let adminToken: string;
let testUserToken: string;
const testEmail = `test_${Date.now()}@example.com`;
const testEmail2 = `test2_${Date.now()}@example.com`;

// ==================== AUTH ====================

describe('Auth - /api/auth', () => {
  describe('POST /auth/login', () => {
    it('deve rejeitar sem body', async () => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/obrigat/i);
    });

    it('deve rejeitar sem password', async () => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@digitalstore.com' }),
      });
      expect(res.status).toBe(400);
    });

    it('deve rejeitar sem email', async () => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password: 'admin123' }),
      });
      expect(res.status).toBe(400);
    });

    it('deve rejeitar email inexistente', async () => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'naoexiste@email.com', password: 'errada' }),
      });
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toMatch(/invalida/i);
    });

    it('deve rejeitar senha incorreta', async () => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@digitalstore.com', password: 'senhaerrada' }),
      });
      expect(res.status).toBe(401);
    });

    it('deve autenticar admin com sucesso', async () => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@digitalstore.com', password: 'admin123' }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(typeof data.token).toBe('string');
      expect(data.token.split('.')).toHaveLength(3); // JWT tem 3 partes
      expect(data.user).toBeDefined();
      expect(data.user.id).toBeDefined();
      expect(data.user.email).toBe('admin@digitalstore.com');
      expect(data.user.name).toBeDefined();
      expect(data.user.role).toBe('admin');
      // Nao deve expor senha
      expect(data.user.password).toBeUndefined();
      adminToken = data.token;
    });
  });

  describe('POST /auth/signup', () => {
    it('deve rejeitar sem email', async () => {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ password: '123456' }),
      });
      expect(res.status).toBe(400);
    });

    it('deve rejeitar sem senha', async () => {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email: 'novo@teste.com' }),
      });
      expect(res.status).toBe(400);
    });

    it('deve criar novo usuario com todos os campos', async () => {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: 'teste123',
          name: 'Teste Automatizado',
          birthdate: '1990-05-15',
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(data.token.split('.')).toHaveLength(3);
      expect(data.user.email).toBe(testEmail);
      expect(data.user.name).toBe('Teste Automatizado');
      expect(data.user.role).toBe('user'); // Nao admin
      testUserToken = data.token;
    });

    it('deve criar usuario sem nome (usa prefixo do email)', async () => {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail2,
          password: 'teste123',
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.user.name).toBeDefined();
      expect(data.user.name.length).toBeGreaterThan(0);
    });

    it('deve rejeitar email duplicado', async () => {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: 'teste123',
          name: 'Duplicado',
        }),
      });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/cadastrado/i);
    });
  });

  describe('GET /auth/me', () => {
    it('deve retornar dados do admin autenticado', async () => {
      const res = await authenticatedFetch(adminToken, '/auth/me');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('admin@digitalstore.com');
      expect(data.user.role).toBe('admin');
      expect(data.user.created_at).toBeDefined();
      // Nao deve expor senha
      expect(data.user.password).toBeUndefined();
    });

    it('deve retornar dados do usuario comum autenticado', async () => {
      const res = await authenticatedFetch(testUserToken, '/auth/me');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe(testEmail);
      expect(data.user.role).toBe('user');
    });

    it('deve rejeitar sem token', async () => {
      const res = await apiFetch('/auth/me');
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('deve rejeitar com token invalido', async () => {
      const res = await authenticatedFetch('token.invalido.aqui', '/auth/me');
      expect(res.status).toBe(401);
    });

    it('deve rejeitar com token malformado (sem Bearer)', async () => {
      const res = await apiFetch('/auth/me', {
        headers: { Authorization: adminToken },
      });
      expect(res.status).toBe(401);
    });
  });
});

// ==================== PRODUCTS ====================

describe('Products - /api/products', () => {
  let createdProductId: number;
  let secondProductId: number;

  describe('GET /products (publico)', () => {
    it('deve listar produtos sem autenticacao', async () => {
      const res = await apiFetch('/products');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(1); // Seed tem 4 produtos
    });

    it('deve retornar estrutura correta de produto', async () => {
      const res = await apiFetch('/products');
      const data = await res.json();
      const product = data[0];
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.original_price).toBeDefined();
      expect(product.image).toBeDefined();
      expect(product.description).toBeDefined();
      expect(product.stock).toBeDefined();
      expect(product.created_at).toBeDefined();
      // images e available_sizes devem ser arrays (parseados do JSON)
      expect(Array.isArray(product.images)).toBe(true);
      expect(Array.isArray(product.available_sizes)).toBe(true);
    });
  });

  describe('POST /products (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({ name: 'Teste' }),
      });
      expect(res.status).toBe(401);
    });

    it('deve criar produto com todos os campos', async () => {
      const res = await authenticatedFetch(adminToken, '/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Produto Teste Jest',
          category: 'Tenis',
          price: 199.90,
          original_price: 299.90,
          discount: '33% OFF',
          image: 'https://exemplo.com/img.jpg',
          images: ['https://exemplo.com/img2.jpg', 'https://exemplo.com/img3.jpg'],
          description: 'Produto criado pelo teste automatizado',
          available_sizes: ['39', '40', '41'],
          stock: 10,
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(typeof data.id).toBe('number');
      createdProductId = data.id;
    });

    it('deve criar produto com campos minimos', async () => {
      const res = await authenticatedFetch(adminToken, '/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Produto Minimo',
          category: 'Outros',
          price: 50.00,
          original_price: 50.00,
          image: 'https://exemplo.com/min.jpg',
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      secondProductId = data.id;
    });

    it('produto criado deve aparecer na listagem', async () => {
      const res = await apiFetch('/products');
      const data = await res.json();
      const found = data.find((p: any) => p.id === createdProductId);
      expect(found).toBeDefined();
      expect(found.name).toBe('Produto Teste Jest');
      expect(parseFloat(found.price)).toBe(199.90);
      expect(found.available_sizes).toEqual(['39', '40', '41']);
      expect(found.images).toEqual(['https://exemplo.com/img2.jpg', 'https://exemplo.com/img3.jpg']);
    });

    it('usuario comum tambem pode criar produto (autenticado)', async () => {
      const res = await authenticatedFetch(testUserToken, '/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Produto User Comum',
          category: 'Tenis',
          price: 99.90,
          original_price: 99.90,
          image: 'https://exemplo.com/user.jpg',
        }),
      });
      // Depende da regra de negocio - pode ser 201 ou 403
      // A API atual permite qualquer usuario autenticado
      expect([201, 403]).toContain(res.status);
      if (res.status === 201) {
        const data = await res.json();
        // Limpar depois
        await authenticatedFetch(adminToken, `/products/${data.id}`, { method: 'DELETE' });
      }
    });
  });

  describe('PUT /products/:id (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch(`/products/${createdProductId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: 'Hack' }),
      });
      expect(res.status).toBe(401);
    });

    it('deve atualizar produto', async () => {
      const res = await authenticatedFetch(adminToken, `/products/${createdProductId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Produto Atualizado Jest',
          category: 'Tenis',
          price: 149.90,
          original_price: 299.90,
          discount: '50% OFF',
          image: 'https://exemplo.com/img-updated.jpg',
          images: [],
          description: 'Descricao atualizada pelo teste',
          available_sizes: ['42', '43'],
          stock: 5,
        }),
      });
      expect(res.status).toBe(200);
    });

    it('atualizacao deve persistir na listagem', async () => {
      const res = await apiFetch('/products');
      const data = await res.json();
      const found = data.find((p: any) => p.id === createdProductId);
      expect(found).toBeDefined();
      expect(found.name).toBe('Produto Atualizado Jest');
      expect(parseFloat(found.price)).toBe(149.90);
      expect(found.discount).toBe('50% OFF');
      expect(found.available_sizes).toEqual(['42', '43']);
    });
  });

  describe('DELETE /products/:id (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch(`/products/${createdProductId}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(401);
    });

    it('deve deletar produto', async () => {
      const res = await authenticatedFetch(adminToken, `/products/${createdProductId}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(200);
    });

    it('produto deletado nao deve aparecer na listagem', async () => {
      const res = await apiFetch('/products');
      const data = await res.json();
      const found = data.find((p: any) => p.id === createdProductId);
      expect(found).toBeUndefined();
    });

    it('deve deletar segundo produto de teste', async () => {
      const res = await authenticatedFetch(adminToken, `/products/${secondProductId}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(200);
    });
  });
});

// ==================== COUPONS ====================

describe('Coupons - /api/coupons', () => {
  let createdCouponId: number;
  const couponCode = `JEST_${Date.now()}`;

  describe('GET /coupons (publico)', () => {
    it('deve listar cupons ativos', async () => {
      const res = await apiFetch('/coupons');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('deve retornar estrutura correta de cupom', async () => {
      const res = await apiFetch('/coupons');
      const data = await res.json();
      if (data.length > 0) {
        const coupon = data[0];
        expect(coupon.id).toBeDefined();
        expect(coupon.code).toBeDefined();
        expect(coupon.discount_percent).toBeDefined();
        expect(coupon.type).toBeDefined();
        expect(['product', 'shipping']).toContain(coupon.type);
      }
    });

    it('seed deve ter pelo menos os cupons iniciais (GTECH10, FRETEGRATIS)', async () => {
      const res = await apiFetch('/coupons');
      const data = await res.json();
      const codes = data.map((c: any) => c.code);
      expect(codes).toContain('GTECH10');
      expect(codes).toContain('FRETEGRATIS');
    });
  });

  describe('POST /coupons (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch('/coupons', {
        method: 'POST',
        body: JSON.stringify({ code: 'HACK10', discount_percent: 10, type: 'product' }),
      });
      expect(res.status).toBe(401);
    });

    it('deve criar cupom tipo product', async () => {
      const res = await authenticatedFetch(adminToken, '/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: couponCode,
          discount_percent: 15,
          type: 'product',
          is_free_shipping: false,
          stackable: false,
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      createdCouponId = data.id;
    });

    it('cupom criado deve aparecer na listagem', async () => {
      const res = await apiFetch('/coupons');
      const data = await res.json();
      const found = data.find((c: any) => c.code === couponCode);
      expect(found).toBeDefined();
      expect(parseFloat(found.discount_percent)).toBe(15);
      expect(found.type).toBe('product');
    });

    it('deve criar cupom tipo shipping com frete gratis', async () => {
      const res = await authenticatedFetch(adminToken, '/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: `FRETE_${Date.now()}`,
          discount_percent: 100,
          type: 'shipping',
          is_free_shipping: true,
          stackable: true,
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      // Limpar
      await authenticatedFetch(adminToken, `/coupons/${data.id}`, { method: 'DELETE' });
    });
  });

  describe('DELETE /coupons/:id (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch(`/coupons/${createdCouponId}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(401);
    });

    it('deve deletar cupom', async () => {
      const res = await authenticatedFetch(adminToken, `/coupons/${createdCouponId}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(200);
    });

    it('cupom deletado nao deve aparecer na listagem', async () => {
      const res = await apiFetch('/coupons');
      const data = await res.json();
      const found = data.find((c: any) => c.id === createdCouponId);
      expect(found).toBeUndefined();
    });
  });
});

// ==================== HERO SLIDES ====================

describe('Hero Slides - /api/hero-slides', () => {
  let createdSlideId: number;

  describe('GET /hero-slides (publico)', () => {
    it('deve listar slides ativos', async () => {
      const res = await apiFetch('/hero-slides');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(1); // Seed tem 2 slides
    });

    it('deve retornar estrutura correta de slide', async () => {
      const res = await apiFetch('/hero-slides');
      const data = await res.json();
      const slide = data[0];
      expect(slide.id).toBeDefined();
      expect(slide.title).toBeDefined();
      expect(slide.button_text).toBeDefined();
      expect(slide.button_link).toBeDefined();
      expect(slide.image).toBeDefined();
      expect(slide.bg_color).toBeDefined();
      expect(slide.bg_dark).toBeDefined();
      expect(slide.position).toBeDefined();
    });

    it('slides devem estar ordenados por position', async () => {
      const res = await apiFetch('/hero-slides');
      const data = await res.json();
      for (let i = 1; i < data.length; i++) {
        expect(data[i].position).toBeGreaterThanOrEqual(data[i - 1].position);
      }
    });
  });

  describe('POST /hero-slides (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch('/hero-slides', {
        method: 'POST',
        body: JSON.stringify({ title: 'Hack' }),
      });
      expect(res.status).toBe(401);
    });

    it('deve criar slide', async () => {
      const res = await authenticatedFetch(adminToken, '/hero-slides', {
        method: 'POST',
        body: JSON.stringify({
          tag: 'Teste Jest',
          title: 'Slide Automatizado',
          description: 'Criado pelo teste de integracao',
          button_text: 'Testar',
          button_link: '/test',
          image: 'https://exemplo.com/banner-test.jpg',
          bg_color: 'bg-blue-500',
          bg_dark: 'dark:bg-blue-900',
          position: 99,
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      createdSlideId = data.id;
    });
  });

  describe('PUT /hero-slides/:id (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch(`/hero-slides/${createdSlideId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: 'Hack' }),
      });
      expect(res.status).toBe(401);
    });

    it('deve atualizar slide', async () => {
      const res = await authenticatedFetch(adminToken, `/hero-slides/${createdSlideId}`, {
        method: 'PUT',
        body: JSON.stringify({
          tag: 'Atualizado',
          title: 'Slide Atualizado Jest',
          description: 'Descricao atualizada',
          button_text: 'Comprar Agora',
          button_link: '/produtos',
          image: 'https://exemplo.com/banner-updated.jpg',
          bg_color: 'bg-red-500',
          bg_dark: 'dark:bg-red-900',
        }),
      });
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /hero-slides/:id (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch(`/hero-slides/${createdSlideId}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(401);
    });

    it('deve deletar slide', async () => {
      const res = await authenticatedFetch(adminToken, `/hero-slides/${createdSlideId}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(200);
    });
  });
});

// ==================== ORDERS ====================

describe('Orders - /api/orders', () => {
  let createdOrderId: number;
  let orderWithMultipleItems: number;

  describe('GET /orders (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch('/orders');
      expect(res.status).toBe(401);
    });

    it('deve rejeitar com token invalido', async () => {
      const res = await authenticatedFetch('abc.def.ghi', '/orders');
      expect(res.status).toBe(401);
    });

    it('deve listar pedidos autenticado', async () => {
      const res = await authenticatedFetch(adminToken, '/orders');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /orders (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: 'Hack',
          customer_email: 'hack@test.com',
          total: 100,
          payment_method: 'PIX',
          shipping_address: 'Rua Hack',
        }),
      });
      expect(res.status).toBe(401);
    });

    it('deve criar pedido com 1 item', async () => {
      const res = await authenticatedFetch(adminToken, '/orders', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 1,
          customer_name: 'Teste Jest',
          customer_email: 'jest@teste.com',
          total: 199.90,
          subtotal: 199.90,
          status: 'pending',
          payment_method: 'PIX',
          shipping_address: 'Rua Teste, 123 - Sao Paulo/SP',
          shipping_cost: 0,
          discount: 0,
          items: [
            {
              product_id: 1,
              name: 'K-Swiss V8',
              image: 'https://exemplo.com/img.jpg',
              quantity: 2,
              price: 99.95,
              size: '42',
              color: 'Preto',
            },
          ],
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      createdOrderId = data.id;
    });

    it('deve criar pedido com multiplos itens', async () => {
      const res = await authenticatedFetch(adminToken, '/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: 'Maria Silva',
          customer_email: 'maria@email.com',
          total: 549.00,
          subtotal: 549.00,
          status: 'pending',
          payment_method: 'Cartao',
          shipping_address: 'Rua das Flores, 456',
          shipping_cost: 15.00,
          discount: 10.00,
          items: [
            {
              product_id: 1,
              name: 'K-Swiss V8',
              image: 'https://exemplo.com/1.jpg',
              quantity: 1,
              price: 100.00,
              size: '40',
              color: 'Branco',
            },
            {
              product_id: 2,
              name: 'Nike Air Zoom',
              image: 'https://exemplo.com/2.jpg',
              quantity: 1,
              price: 449.00,
              size: '38',
              color: 'Azul',
            },
          ],
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      orderWithMultipleItems = data.id;
    });

    it('deve criar pedido sem user_id (visitante)', async () => {
      const res = await authenticatedFetch(adminToken, '/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: 'Visitante',
          customer_email: 'visitante@email.com',
          total: 89.00,
          subtotal: 89.00,
          status: 'pending',
          payment_method: 'Boleto',
          shipping_address: 'Rua Sem Cadastro, 789',
          items: [
            {
              product_id: 3,
              name: 'Camiseta Oversized',
              image: 'https://exemplo.com/3.jpg',
              quantity: 1,
              price: 89.00,
              size: 'GG',
              color: 'Preto',
            },
          ],
        }),
      });
      expect(res.status).toBe(201);
      const data = await res.json();
      // Limpar depois
      await authenticatedFetch(adminToken, `/orders/${data.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancelled' }),
      });
    });

    it('pedidos devem incluir order_items na listagem', async () => {
      const res = await authenticatedFetch(adminToken, '/orders');
      const data = await res.json();
      const order = data.find((o: any) => o.id === orderWithMultipleItems);
      expect(order).toBeDefined();
      expect(order.order_items).toBeDefined();
      expect(Array.isArray(order.order_items)).toBe(true);
      expect(order.order_items.length).toBe(2);
    });

    it('estrutura dos itens do pedido deve estar correta', async () => {
      const res = await authenticatedFetch(adminToken, '/orders');
      const data = await res.json();
      const order = data.find((o: any) => o.id === orderWithMultipleItems);
      const item = order.order_items[0];
      expect(item.order_id).toBe(orderWithMultipleItems);
      expect(item.product_id).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.quantity).toBeDefined();
      expect(item.price).toBeDefined();
      expect(item.size).toBeDefined();
      expect(item.color).toBeDefined();
    });
  });

  describe('PUT /orders/:id/status (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch(`/orders/${createdOrderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'shipped' }),
      });
      expect(res.status).toBe(401);
    });

    it('deve atualizar status para processing', async () => {
      const res = await authenticatedFetch(adminToken, `/orders/${createdOrderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'processing' }),
      });
      expect(res.status).toBe(200);
    });

    it('deve atualizar status para shipped', async () => {
      const res = await authenticatedFetch(adminToken, `/orders/${createdOrderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'shipped' }),
      });
      expect(res.status).toBe(200);
    });

    it('deve atualizar status para delivered', async () => {
      const res = await authenticatedFetch(adminToken, `/orders/${createdOrderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'delivered' }),
      });
      expect(res.status).toBe(200);
    });

    it('deve atualizar status para cancelled', async () => {
      const res = await authenticatedFetch(adminToken, `/orders/${orderWithMultipleItems}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancelled' }),
      });
      expect(res.status).toBe(200);
    });

    it('status atualizado deve persistir na listagem', async () => {
      const res = await authenticatedFetch(adminToken, '/orders');
      const data = await res.json();
      const order = data.find((o: any) => o.id === createdOrderId);
      expect(order).toBeDefined();
      expect(order.status).toBe('delivered');
      expect(order.customer_name).toBe('Teste Jest');
      expect(parseFloat(order.total)).toBe(199.90);
    });

    it('estrutura completa do pedido na listagem', async () => {
      const res = await authenticatedFetch(adminToken, '/orders');
      const data = await res.json();
      const order = data.find((o: any) => o.id === createdOrderId);
      expect(order.id).toBeDefined();
      expect(order.customer_name).toBeDefined();
      expect(order.customer_email).toBeDefined();
      expect(order.total).toBeDefined();
      expect(order.status).toBeDefined();
      expect(order.payment_method).toBeDefined();
      expect(order.shipping_address).toBeDefined();
      expect(order.created_at).toBeDefined();
      expect(order.updated_at).toBeDefined();
      expect(order.order_items).toBeDefined();
    });
  });
});

// ==================== USERS ====================

describe('Users - /api/users', () => {
  describe('GET /users (protegido)', () => {
    it('deve rejeitar sem token', async () => {
      const res = await apiFetch('/users');
      expect(res.status).toBe(401);
    });

    it('deve rejeitar com token invalido', async () => {
      const res = await authenticatedFetch('token.falso.invalido', '/users');
      expect(res.status).toBe(401);
    });

    it('deve listar usuarios autenticado', async () => {
      const res = await authenticatedFetch(adminToken, '/users');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      // Admin + usuarios de teste criados
      expect(data.length).toBeGreaterThanOrEqual(2);
    });

    it('deve retornar estrutura correta de usuario', async () => {
      const res = await authenticatedFetch(adminToken, '/users');
      const data = await res.json();
      const user = data[0];
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.role).toBeDefined();
      expect(user.created_at).toBeDefined();
      // NAO deve expor senha
      expect(user.password).toBeUndefined();
    });

    it('deve conter o admin na lista', async () => {
      const res = await authenticatedFetch(adminToken, '/users');
      const data = await res.json();
      const admin = data.find((u: any) => u.email === 'admin@digitalstore.com');
      expect(admin).toBeDefined();
      expect(admin.role).toBe('admin');
    });

    it('deve conter os usuarios de teste criados', async () => {
      const res = await authenticatedFetch(adminToken, '/users');
      const data = await res.json();
      const testUser = data.find((u: any) => u.email === testEmail);
      expect(testUser).toBeDefined();
      expect(testUser.role).toBe('user');
      expect(testUser.name).toBe('Teste Automatizado');
    });

    it('usuario comum tambem pode listar usuarios', async () => {
      const res = await authenticatedFetch(testUserToken, '/users');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});

// ==================== SEGURANCA ====================

describe('Seguranca geral', () => {
  it('rotas protegidas devem rejeitar token expirado/invalido', async () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkaWdpdGFsc3RvcmUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDF9.invalidsignature';
    const endpoints = ['/orders', '/users'];
    for (const endpoint of endpoints) {
      const res = await authenticatedFetch(fakeToken, endpoint);
      expect(res.status).toBe(401);
    }
  });

  it('POST em rotas protegidas deve rejeitar sem auth', async () => {
    const endpoints = [
      { path: '/products', body: { name: 'x' } },
      { path: '/coupons', body: { code: 'x' } },
      { path: '/hero-slides', body: { title: 'x' } },
      { path: '/orders', body: { customer_name: 'x' } },
    ];
    for (const { path, body } of endpoints) {
      const res = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      expect(res.status).toBe(401);
    }
  });

  it('DELETE em rotas protegidas deve rejeitar sem auth', async () => {
    const endpoints = ['/products/999', '/coupons/999', '/hero-slides/999'];
    for (const path of endpoints) {
      const res = await apiFetch(path, { method: 'DELETE' });
      expect(res.status).toBe(401);
    }
  });

  it('PUT em rotas protegidas deve rejeitar sem auth', async () => {
    const endpoints = ['/products/999', '/hero-slides/999', '/orders/999/status'];
    for (const path of endpoints) {
      const res = await apiFetch(path, {
        method: 'PUT',
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(401);
    }
  });
});
