# Gtech Digital Store

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Jest](https://img.shields.io/badge/jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

<br />

**Plataforma e-commerce fullstack com backend API REST, testes automatizados e deploy containerizado.**

</div>

---

## Sobre o Projeto

E-commerce completo de tenis e streetwear com frontend React, backend Node.js/Express, banco MySQL e infraestrutura Docker. Inclui painel administrativo, autenticacao JWT, documentacao Swagger e 78 testes de integracao.

---

## Tecnologias

| Camada   | Stack                                          |
| -------- | ---------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, TailwindCSS        |
| Backend  | Node.js, Express, JWT, bcrypt, Swagger         |
| Banco    | MySQL 8.0                                      |
| Testes   | Jest, ts-jest, Test Runner visual (browser)     |
| Infra    | Docker, Docker Compose                         |
| Deploy   | Vercel (frontend) + Railway (API + MySQL)      |

---

## Funcionalidades

### Frontend
- Carrinho de compras com calculo de totais
- Busca de produtos com sugestoes em tempo real
- Catalogo com filtros por categoria
- Favoritos com persistencia local
- Fluxo completo de checkout
- Rastreamento de pedidos com timeline visual
- Historico de pedidos (Meus Pedidos)
- Tema escuro/claro (Dark Mode)
- Layout responsivo (Mobile-First)
- Animacoes com Framer Motion

### Painel Administrativo
- Dashboard com metricas
- CRUD de produtos (criar, editar, excluir)
- Gestao de pedidos (alterar status)
- Gestao de cupons de desconto
- Gestao de banners da pagina inicial
- Listagem de clientes cadastrados

### Backend API REST
- Autenticacao JWT (login, signup, /me)
- CRUD completo: produtos, cupons, hero slides, pedidos, usuarios
- Hash de senha com bcrypt
- Documentacao interativa Swagger (`/api/docs`)
- Test Runner visual no browser (`/api/tests`)
- CORS configurado para producao

---

## Pre-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando

---

## Como rodar o projeto

### 1. Clone o repositorio

```bash
git clone https://github.com/SudoBrunoGomes/projeto-gtech-digital_store.git
cd projeto-gtech-digital_store
```

### 2. Suba todos os containers

```bash
docker compose up --build
```

Aguarde ate ver as mensagens:

```
mysql-1  | ready for connections
api-1    | Conectado ao MySQL!
api-1    | API rodando na porta 4000
app-1    | VITE vx.x.x ready in xxx ms
```

### 3. Acesse a aplicacao

| Servico              | URL                              |
| -------------------- | -------------------------------- |
| Frontend (Loja)      | http://localhost:3000             |
| API Backend          | http://localhost:4000/api         |
| Swagger (Docs)       | http://localhost:4000/api/docs    |
| Test Runner          | http://localhost:4000/api/tests   |

---

## Credenciais de acesso

| Tipo  | Email                      | Senha      |
| ----- | -------------------------- | ---------- |
| Admin | admin@digitalstore.com     | admin123   |

> Voce tambem pode criar uma conta de usuario comum pela tela de cadastro do frontend.

---

## Testes automatizados

O projeto possui **78 testes de integracao** que validam toda a API. Existem duas formas de executar:

### Opcao 1 - Test Runner visual (navegador)

1. Acesse http://localhost:4000/api/tests
2. Clique no botao **"Executar Testes"**
3. Acompanhe a execucao em tempo real no terminal integrado

O Test Runner exibe:
- Barra de progresso com contadores (total, passou, falhou, tempo)
- Saida estilo terminal com resultado de cada teste (verde = passou, vermelho = falhou)
- Resumo final com total de testes e tempo de execucao

> Tambem e possivel acessar o Test Runner pelo link na pagina do Swagger (http://localhost:4000/api/docs).

### Opcao 2 - Jest via linha de comando

```bash
npm test
```

Saida esperada:

```
PASS __tests__/api.test.ts
PASS __tests__/utils.test.ts

Test Suites: 2 passed, 2 total
Tests:       78 passed, 78 total
Time:        ~2s
```

> Os testes via Jest requerem que o Docker esteja rodando (API na porta 4000).

### Cobertura dos testes

| Suite            | Testes | O que valida                                              |
| ---------------- | ------ | --------------------------------------------------------- |
| Auth             | 14     | Login, signup, /me, validacoes, token invalido/malformado |
| Products         | 14     | CRUD completo, estrutura de resposta, persistencia        |
| Coupons          | 10     | CRUD, seed data, tipos product/shipping                   |
| Hero Slides      | 9      | CRUD, ordenacao por position, estrutura                   |
| Orders           | 15     | CRUD, multiplos itens, fluxo de status completo           |
| Users            | 7      | Listagem, estrutura, senha nao exposta                    |
| Seguranca        | 4      | Token falso, guards em POST/PUT/DELETE                    |
| Utils            | 2      | Testes unitarios basicos                                  |

---

## Testando a API pelo Swagger

### Passo 1 - Abrir o Swagger

Acesse http://localhost:4000/api/docs no navegador.

Voce vera todas as rotas organizadas por grupo: **Auth**, **Produtos**, **Cupons**, **Hero Slides**, **Pedidos** e **Usuarios**.

### Passo 2 - Fazer login para obter o token

1. Expanda a secao **Auth**
2. Clique em **POST /api/auth/login**
3. Clique em **"Try it out"**
4. No campo do body, use:

```json
{
  "email": "admin@digitalstore.com",
  "password": "admin123"
}
```

5. Clique em **"Execute"**
6. Na resposta, copie o valor do campo `"token"` (sem as aspas)

### Passo 3 - Autorizar as rotas protegidas

1. No topo da pagina do Swagger, clique no botao **"Authorize"** (icone de cadeado)
2. No campo de texto, cole o token copiado no formato:

```
Bearer eyJhbGciOiJIUzI1NiIs...
```

3. Clique em **"Authorize"** e depois em **"Close"**

> Agora todas as rotas protegidas (que exigem autenticacao) estao liberadas para teste.

### Passo 4 - Testar as rotas

Exemplos de testes que voce pode fazer:

#### Listar produtos

1. Expanda **Produtos** > **GET /api/products**
2. Clique em **"Try it out"** > **"Execute"**
3. Os produtos cadastrados serao retornados

#### Criar um produto

1. Expanda **Produtos** > **POST /api/products**
2. Clique em **"Try it out"**
3. Preencha o body com:

```json
{
  "name": "Adidas Ultraboost",
  "category": "Tenis",
  "price": 399.90,
  "original_price": 599.90,
  "discount": "33% OFF",
  "image": "https://exemplo.com/img.jpg",
  "images": [],
  "description": "Tenis de corrida com tecnologia Boost",
  "available_sizes": ["39", "40", "41", "42"],
  "stock": 30
}
```

4. Clique em **"Execute"**
5. A resposta `201` confirma que o produto foi criado

#### Criar um cupom

1. Expanda **Cupons** > **POST /api/coupons**
2. Clique em **"Try it out"**
3. Use o body:

```json
{
  "code": "GTECH20",
  "discount_percent": 20,
  "type": "product",
  "is_free_shipping": false,
  "stackable": false
}
```

4. Clique em **"Execute"**

#### Criar um pedido

1. Expanda **Pedidos** > **POST /api/orders**
2. Clique em **"Try it out"**
3. Use o body:

```json
{
  "user_id": 1,
  "customer_name": "Joao Silva",
  "customer_email": "joao@email.com",
  "total": 299.90,
  "subtotal": 299.90,
  "status": "pending",
  "payment_method": "PIX",
  "shipping_address": "Rua Exemplo, 123 - Sao Paulo/SP",
  "shipping_cost": 0,
  "discount": 0,
  "items": [
    {
      "product_id": 1,
      "name": "K-Swiss V8 - Masculino",
      "image": "https://exemplo.com/img.jpg",
      "quantity": 1,
      "price": 100,
      "size": "42",
      "color": "Preto"
    }
  ]
}
```

4. Clique em **"Execute"**

#### Atualizar status de pedido

1. Expanda **Pedidos** > **PUT /api/orders/{id}/status**
2. Clique em **"Try it out"**
3. No campo `id`, digite `1`
4. No body:

```json
{
  "status": "shipped"
}
```

5. Clique em **"Execute"**

#### Listar usuarios

1. Expanda **Usuarios** > **GET /api/users**
2. Clique em **"Try it out"** > **"Execute"**
3. Todos os usuarios cadastrados serao retornados

---

## Testando o Frontend

### Pagina inicial

Acesse http://localhost:3000. Os produtos e banners iniciais sao carregados automaticamente na primeira execucao.

### Fluxo de compra

1. Navegue pelos produtos na pagina inicial ou em **"Produtos"**
2. Clique em um produto para ver os detalhes
3. Selecione tamanho e adicione ao carrinho
4. Va ao carrinho e finalize o pedido

### Painel administrativo

1. Faca login com `admin@digitalstore.com` / `admin123`
2. Acesse o painel admin pelo menu do usuario
3. No painel voce pode:
   - Gerenciar produtos (criar, editar, excluir)
   - Gerenciar pedidos (alterar status)
   - Gerenciar cupons
   - Gerenciar banners da pagina inicial
   - Visualizar clientes cadastrados

---

## Parar o projeto

```bash
docker compose down
```

Para apagar tambem os dados do banco:

```bash
docker compose down -v
```

---

## Endpoints da API

### Rotas publicas (sem autenticacao)

| Metodo | Rota               | Descricao            |
| ------ | ------------------ | -------------------- |
| GET    | /api/products      | Listar produtos      |
| GET    | /api/coupons       | Listar cupons ativos |
| GET    | /api/hero-slides   | Listar banners       |
| GET    | /api/health        | Health check         |

### Rotas de autenticacao

| Metodo | Rota               | Descricao              |
| ------ | ------------------ | ---------------------- |
| POST   | /api/auth/login    | Fazer login            |
| POST   | /api/auth/signup   | Criar conta            |
| GET    | /api/auth/me       | Dados do usuario (JWT) |

### Rotas protegidas (requerem JWT)

| Metodo | Rota                      | Descricao                |
| ------ | ------------------------- | ------------------------ |
| POST   | /api/products             | Criar produto            |
| PUT    | /api/products/:id         | Atualizar produto        |
| DELETE | /api/products/:id         | Deletar produto          |
| POST   | /api/coupons              | Criar cupom              |
| DELETE | /api/coupons/:id          | Deletar cupom            |
| POST   | /api/hero-slides          | Criar banner             |
| PUT    | /api/hero-slides/:id      | Atualizar banner         |
| DELETE | /api/hero-slides/:id      | Deletar banner           |
| GET    | /api/orders               | Listar pedidos           |
| POST   | /api/orders               | Criar pedido             |
| PUT    | /api/orders/:id/status    | Atualizar status pedido  |
| GET    | /api/users                | Listar usuarios          |

---

## Estrutura do Projeto

```
projeto-gtech-digital_store/
├── docker-compose.yml          # Orquestra MySQL + API + Frontend
├── Dockerfile                  # Frontend (Vite dev server)
├── vercel.json                 # Config deploy Vercel
├── __tests__/
│   ├── api.test.ts             # 76 testes de integracao
│   └── utils.test.ts           # 2 testes unitarios
├── mysql/
│   └── init.sql                # Tabelas + seed de dados
├── server/
│   ├── Dockerfile              # Backend API
│   ├── package.json
│   └── src/
│       ├── index.js            # Entry point + Swagger UI
│       ├── db.js               # Conexao MySQL
│       ├── auth.js             # JWT (autenticacao)
│       ├── swagger.js          # Swagger/OpenAPI
│       └── routes/
│           ├── auth.js         # Login / Signup / Me
│           ├── products.js     # CRUD Produtos
│           ├── coupons.js      # CRUD Cupons
│           ├── heroSlides.js   # CRUD Banners
│           ├── orders.js       # CRUD Pedidos
│           ├── users.js        # Listagem de usuarios
│           └── tests.js        # Test Runner visual
└── src/                        # Frontend React
    ├── lib/api.ts              # Client HTTP para a API
    ├── contexts/               # Gerenciamento de estado
    ├── components/             # Componentes reutilizaveis
    └── pages/                  # Paginas da aplicacao
```

---

## Deploy (Producao)

| Servico  | Plataforma | URL                                          |
| -------- | ---------- | -------------------------------------------- |
| Frontend | Vercel     | https://seu-projeto.vercel.app               |
| API      | Railway    | https://seu-projeto.up.railway.app/api       |
| Swagger  | Railway    | https://seu-projeto.up.railway.app/api/docs  |
| Tests    | Railway    | https://seu-projeto.up.railway.app/api/tests |

---

## Contribuidores

| Desenvolvedor | GitHub |
| --- | --- |
| **Bruno Gomes** | [@SudoBrunoGomes](https://github.com/SudoBrunoGomes) |
| **Marcos Sousa** | [@marcosA-sousa](https://github.com/marcosA-sousa) |
| **Victor Nascimento** | [@VictorNascimento14](https://github.com/VictorNascimento14) |
