import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const products = rows.map(p => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
      available_sizes: typeof p.available_sizes === 'string' ? JSON.parse(p.available_sizes || '[]') : (p.available_sizes || []),
    }));
    res.json(products);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produto criado
 *       401:
 *         description: Nao autenticado
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, price, original_price, discount, image, images, description, available_sizes, stock } = req.body;
    const [result] = await pool.query(
      `INSERT INTO products (name, category, price, original_price, discount, image, images, description, available_sizes, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category, price, original_price, discount || '', image, JSON.stringify(images || []), description || '', JSON.stringify(available_sizes || []), stock || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       401:
 *         description: Nao autenticado
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, price, original_price, discount, image, images, description, available_sizes, stock } = req.body;
    await pool.query(
      `UPDATE products SET name=?, category=?, price=?, original_price=?, discount=?, image=?, images=?, description=?, available_sizes=?, stock=?, updated_at=NOW()
       WHERE id=?`,
      [name, category, price, original_price, discount || '', image, JSON.stringify(images || []), description || '', JSON.stringify(available_sizes || []), stock || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deletar produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto deletado
 *       401:
 *         description: Nao autenticado
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
