import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gtech Store API',
      version: '1.0.0',
      description: 'API da loja Gtech Store - E-commerce de tenis e streetwear',
    },
    servers: [
      { url: process.env.API_PUBLIC_URL || 'http://localhost:4000', description: process.env.API_PUBLIC_URL ? 'Railway (producao)' : 'Servidor local' },
      ...(process.env.API_PUBLIC_URL ? [{ url: 'http://localhost:4000', description: 'Servidor local' }] : []),
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'K-Swiss V8 - Masculino' },
            category: { type: 'string', example: 'Tenis' },
            price: { type: 'number', example: 100 },
            original_price: { type: 'number', example: 200 },
            discount: { type: 'string', example: '30% OFF' },
            image: { type: 'string', example: 'https://exemplo.com/img.jpg' },
            images: { type: 'array', items: { type: 'string' } },
            description: { type: 'string', example: 'Tenis classico de alta durabilidade' },
            available_sizes: { type: 'array', items: { type: 'string' }, example: ['39', '40', '41'] },
            stock: { type: 'integer', example: 50 },
          },
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'category', 'price', 'original_price', 'image'],
          properties: {
            name: { type: 'string', example: 'Nike Air Max' },
            category: { type: 'string', example: 'Tenis' },
            price: { type: 'number', example: 350 },
            original_price: { type: 'number', example: 500 },
            discount: { type: 'string', example: '30% OFF' },
            image: { type: 'string', example: 'https://exemplo.com/img.jpg' },
            images: { type: 'array', items: { type: 'string' } },
            description: { type: 'string', example: 'Tenis de corrida premium' },
            available_sizes: { type: 'array', items: { type: 'string' }, example: ['38', '39', '40'] },
            stock: { type: 'integer', example: 25 },
          },
        },
        Coupon: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'DESCONTO10' },
            discount_percent: { type: 'number', example: 10 },
            type: { type: 'string', enum: ['product', 'shipping'], example: 'product' },
            is_free_shipping: { type: 'boolean', example: false },
            stackable: { type: 'boolean', example: false },
          },
        },
        CouponInput: {
          type: 'object',
          required: ['code', 'discount_percent', 'type'],
          properties: {
            code: { type: 'string', example: 'FRETE0' },
            discount_percent: { type: 'number', example: 15 },
            type: { type: 'string', enum: ['product', 'shipping'], example: 'shipping' },
            is_free_shipping: { type: 'boolean', example: true },
            stackable: { type: 'boolean', example: false },
          },
        },
        HeroSlide: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            tag: { type: 'string', example: 'Melhores ofertas' },
            title: { type: 'string', example: 'Queima de estoque Nike' },
            description: { type: 'string' },
            button_text: { type: 'string', example: 'Ver Ofertas' },
            button_link: { type: 'string', example: '/produtos' },
            image: { type: 'string' },
            bg_color: { type: 'string', example: 'bg-[#F5F5F5]' },
            bg_dark: { type: 'string', example: 'dark:bg-gray-900/50' },
            position: { type: 'integer', example: 0 },
          },
        },
        HeroSlideInput: {
          type: 'object',
          required: ['title', 'button_text', 'button_link', 'image'],
          properties: {
            tag: { type: 'string', example: 'Promocao' },
            title: { type: 'string', example: 'Novo Drop' },
            description: { type: 'string', example: 'Confira as novidades' },
            button_text: { type: 'string', example: 'Comprar' },
            button_link: { type: 'string', example: '/produtos' },
            image: { type: 'string', example: 'https://exemplo.com/banner.jpg' },
            bg_color: { type: 'string', example: 'bg-[#F5F5F5]' },
            bg_dark: { type: 'string', example: 'dark:bg-gray-900/50' },
            position: { type: 'integer', example: 0 },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', nullable: true },
            customer_name: { type: 'string', example: 'Joao Silva' },
            customer_email: { type: 'string', example: 'joao@email.com' },
            total: { type: 'number', example: 299.90 },
            subtotal: { type: 'number', example: 299.90 },
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
            payment_method: { type: 'string', example: 'PIX' },
            shipping_address: { type: 'string', example: 'Rua Exemplo, 123' },
            order_items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          },
        },
        OrderInput: {
          type: 'object',
          required: ['customer_name', 'customer_email', 'total', 'payment_method', 'shipping_address', 'items'],
          properties: {
            user_id: { type: 'integer', nullable: true, example: 1 },
            customer_name: { type: 'string', example: 'Joao Silva' },
            customer_email: { type: 'string', example: 'joao@email.com' },
            total: { type: 'number', example: 299.90 },
            subtotal: { type: 'number', example: 299.90 },
            status: { type: 'string', example: 'pending' },
            payment_method: { type: 'string', example: 'PIX' },
            shipping_address: { type: 'string', example: 'Rua Exemplo, 123' },
            shipping_cost: { type: 'number', example: 0 },
            discount: { type: 'number', example: 0 },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product_id: { type: 'integer', example: 1 },
                  name: { type: 'string', example: 'K-Swiss V8' },
                  image: { type: 'string', example: 'https://exemplo.com/img.jpg' },
                  quantity: { type: 'integer', example: 2 },
                  price: { type: 'number', example: 100 },
                  size: { type: 'string', example: '42' },
                  color: { type: 'string', example: 'Preto' },
                },
              },
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            order_id: { type: 'integer' },
            product_id: { type: 'integer' },
            name: { type: 'string' },
            image: { type: 'string' },
            quantity: { type: 'integer' },
            price: { type: 'number' },
            size: { type: 'string' },
            color: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'joao@email.com' },
            name: { type: 'string', example: 'Joao' },
            role: { type: 'string', enum: ['user', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@digitalstore.com' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        SignUpInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'usuario@email.com' },
            password: { type: 'string', example: 'senha123' },
            name: { type: 'string', example: 'Joao Silva' },
            birthdate: { type: 'string', example: '2000-01-15' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
