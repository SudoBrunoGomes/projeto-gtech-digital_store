import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Listar cupons ativos
 *     tags: [Cupons]
 *     responses:
 *       200:
 *         description: Lista de cupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 */
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE active = true');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Criar cupom
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CouponInput'
 *     responses:
 *       201:
 *         description: Cupom criado
 *       401:
 *         description: Nao autenticado
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { code, discount_percent, type, is_free_shipping, stackable } = req.body;
    const [result] = await pool.query(
      'INSERT INTO coupons (code, discount_percent, type, is_free_shipping, stackable) VALUES (?, ?, ?, ?, ?)',
      [code, discount_percent, type, is_free_shipping || false, stackable || false]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar cupom:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Deletar cupom
 *     tags: [Cupons]
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
 *         description: Cupom deletado
 *       401:
 *         description: Nao autenticado
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
