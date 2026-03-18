-- ============================================
-- GTECH STORE - MySQL Init Script
-- ============================================

CREATE DATABASE IF NOT EXISTS gtech_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gtech_store;
SET NAMES utf8mb4;

-- Tabela de usuarios
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  birthdate DATE DEFAULT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  discount VARCHAR(50) DEFAULT '',
  image TEXT NOT NULL,
  images JSON DEFAULT ('[]'),
  description TEXT,
  available_sizes JSON DEFAULT ('[]'),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de cupons
CREATE TABLE IF NOT EXISTS coupons (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  discount_percent DECIMAL(5, 2) NOT NULL,
  type ENUM('product', 'shipping') NOT NULL,
  is_free_shipping BOOLEAN DEFAULT FALSE,
  stackable BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de slides do hero/banner
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tag VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  button_text VARCHAR(100) NOT NULL,
  button_link VARCHAR(255) NOT NULL,
  image TEXT NOT NULL,
  bg_color VARCHAR(50) DEFAULT 'bg-[#F5F5F5]',
  bg_dark VARCHAR(50) DEFAULT 'dark:bg-gray-900/50',
  position INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT DEFAULT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(100) NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de itens dos pedidos
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  image TEXT,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(20),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Usuario admin padrao (senha: admin123)
INSERT INTO users (email, password, name, role) VALUES
('admin@digitalstore.com', '$2a$10$dg7RoCRKO4ypQSC.BehKHuo4suah9oPB9apG.uN1N.cH5zD.8/rGK', 'Admin', 'admin');

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Produtos
INSERT INTO products (name, category, price, original_price, discount, image, images, description, available_sizes, stock) VALUES
('K-Swiss V8 - Masculino', 'Tênis', 100.00, 200.00, '30% OFF',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAiKDAo_-meifwjMo62TERQRYtAZG_qFOzYpJLsh04psDqmyb8oo9brE8kHkZs6Qv54h0w2E9QP2u1VynEs_swtPa0cBZSwLELvo_mtyeU1bfjEIBD4kGERlb0D5UUZhfBaq67efkb6dUddS-3cw1v3yjUFg5i7Qh5YRejIWVKIafU3L5BG9N5k49tUIZprh6R3_W9VdXQyfH9iE8vaUQGE4PTKaKg4ntT8cOkSNWJMhRQ5ABMrnvjpxihYE3gII3FqgswPlTHBP4',
 '["https://lh3.googleusercontent.com/aida-public/AB6AXuBAiKDAo_-meifwjMo62TERQRYtAZG_qFOzYpJLsh04psDqmyb8oo9brE8kHkZs6Qv54h0w2E9QP2u1VynEs_swtPa0cBZSwLELvo_mtyeU1bfjEIBD4kGERlb0D5UUZhfBaq67efkb6dUddS-3cw1v3yjUFg5i7Qh5YRejIWVKIafU3L5BG9N5k49tUIZprh6R3_W9VdXQyfH9iE8vaUQGE4PTKaKg4ntT8cOkSNWJMhRQ5ABMrnvjpxihYE3gII3FqgswPlTHBP4","https://lh3.googleusercontent.com/aida-public/AB6AXuDGa_Oovzx3d_-nzNXp7yPBAZ1jbIRMFxvwYrUEp9GPQ95Sqq3JjhoKvlBQ2jo4kYpNCRIa4Aoy7BK-uC3IU9kBRo8g-wVrObnnguw6DtNE8Hjcp0m8jjsVAkGNqgEyq7TNBRxxx1uYQkrV9KTTCib3UrVtGkpStPecZWvYRFI2pvm-7-QF67KhjfF-zWfC23GTXSbSACt_pMBM9kav1HgQyQnKvtE9MBeaBcc0ARCwvrAcKQNHc62AJqh_U4JsNIc2ItauB-l7dIo"]',
 'Tênis clássico de alta durabilidade, perfeito para o dia a dia com um toque de elegância esportiva.',
 '["39","40","41","42"]', 50),

('Nike Air Zoom - Performance', 'Tênis', 450.00, 600.00, '25% OFF',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGa_Oovzx3d_-nzNXp7yPBAZ1jbIRMFxvwYrUEp9GPQ95Sqq3JjhoKvlBQ2jo4kYpNCRIa4Aoy7BK-uC3IU9kBRo8g-wVrObnnguw6DtNE8Hjcp0m8jjsVAkGNqgEyq7TNBRxxx1uYQkrV9KTTCib3UrVtGkpStPecZWvYRFI2pvm-7-QF67KhjfF-zWfC23GTXSbSACt_pMBM9kav1HgQyQnKvtE9MBeaBcc0ARCwvrAcKQNHc62AJqh_U4JsNIc2ItauB-l7dIo',
 '["https://lh3.googleusercontent.com/aida-public/AB6AXuDGa_Oovzx3d_-nzNXp7yPBAZ1jbIRMFxvwYrUEp9GPQ95Sqq3JjhoKvlBQ2jo4kYpNCRIa4Aoy7BK-uC3IU9kBRo8g-wVrObnnguw6DtNE8Hjcp0m8jjsVAkGNqgEyq7TNBRxxx1uYQkrV9KTTCib3UrVtGkpStPecZWvYRFI2pvm-7-QF67KhjfF-zWfC23GTXSbSACt_pMBM9kav1HgQyQnKvtE9MBeaBcc0ARCwvrAcKQNHc62AJqh_U4JsNIc2ItauB-l7dIo"]',
 'Tecnologia de ponta em amortecimento para atletas que não abrem mão de performance e estilo.',
 '["37","38","43"]', 35),

('Camiseta Streetwear Oversized', 'Camisetas', 89.00, 120.00, '',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLZ99kaZmHfxrXpfJn3AOiwyd_R5iPBDzmSTaYSy-3p6NOFuXY_pMeV05rL95sUd8EGbvU3w2h_ABZDkJdo5QTdAD2jKgJkKG-y2XWQvBjpPmCb6ipXCl5UtoNpTO9m9jh0QhDzCiBokrF0_z9lqk9kZxglJjEIxRyYI-KcFIlbAdvxWHdL5hCbLNIT40nsx-sYXMVOBabYS-JAaKyp-t_jCleijH3tVPfedr09zd1Sxhc45-8DtvPd6kONYm2poRSjEgorewWwcQ',
 '[]',
 'Corte moderno e tecido premium para um visual urbano autêntico e confortável.',
 '[]', 40),

('Fone Bluetooth Bass Pro', 'Headphones', 299.00, 399.00, '',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYgb6P9bQ4v43KFi7dV6bgsssQHJ2BFoDgMErPMe2rk4dO0vJg4akGsPTpEHNsXAglHxOszOYruTOuirRSaeFkYfdVBLNCdw1WqAwvosYzGqPUBX3Q8Ai1v6xmLQ6peahjWT8Uld1rgjb1EeITnpiX0c70eLVwiW3pb5FyNGvpzeUP7PhUMbMkBsfvpT55-RLNHZkb1IrbJHiTQLok5d4tvOz2K_H_NOXKMEY6Ys1-RCdTau0SK2yz_pUDn2--25M_XcuDOLK0qw',
 '[]',
 'Som cristalino e graves potentes com cancelamento de ruído ativo.',
 '[]', 25);

-- Hero Slides (banners da pagina inicial)
INSERT INTO hero_slides (tag, title, description, button_text, button_link, image, bg_color, bg_dark, position) VALUES
('Melhores ofertas personalizadas', 'Queima de stoque Nike 🔥',
 'Consequat culpa exercitation mollit nisi excepteur do do tempor laboris eiusmod irure consectetur.',
 'Ver Ofertas', '/produtos',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrPlN5J3q2tsm7xm5e8eDdL_DkVtbmB6yR6VuTr2tANhXyZLdX1mim9RtryWY2lUmfMVU27oS51yF983BT69sgAZUR3MhgCZKBsB3xRsmnkAXQnGVasWnY-Gec02NiJ4lkcFwVL8nGrRk8PffbhMIOW3ges4GZPjRIH04sjefT5Bml3hgkYChyixCQb_oNSXDOp0iTLL--f0SJW2yKl3EIMED1f9re_SNsd9PePFiEG3lABSMroLLPPga_9oY40TMEBWuGncSXx3c',
 'bg-[#F5F5F5]', 'dark:bg-gray-900/50', 0),

('Tendências 2025', 'O estilo que você domina 👟',
 'Descubra a coleção que está redefinindo o streetwear. Conforto incomparável e a exclusividade que o seu corre merece.',
 'Aproveitar Ofertas', '/produtos',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrPlN5J3q2tsm7xm5e8eDdL_DkVtbmB6yR6VuTr2tANhXyZLdX1mim9RtryWY2lUmfMVU27oS51yF983BT69sgAZUR3MhgCZKBsB3xRsmnkAXQnGVasWnY-Gec02NiJ4lkcFwVL8nGrRk8PffbhMIOW3ges4GZPjRIH04sjefT5Bml3hgkYChyixCQb_oNSXDOp0iTLL--f0SJW2yKl3EIMED1f9re_SNsd9PePFiEG3lABSMroLLPPga_9oY40TMEBWuGncSXx3c',
 'bg-[#F5F5F5]', 'dark:bg-gray-900/50', 1);

-- Cupons de exemplo
INSERT INTO coupons (code, discount_percent, type, is_free_shipping, stackable) VALUES
('GTECH10', 10.00, 'product', FALSE, FALSE),
('FRETEGRATIS', 100.00, 'shipping', TRUE, TRUE);
