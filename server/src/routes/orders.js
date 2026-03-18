import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar todos os pedidos (com itens)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Nao autenticado
 */
router.get('/', authMiddleware, async (_req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const [items] = await pool.query('SELECT * FROM order_items');

    const ordersWithItems = orders.map(order => ({
      ...order,
      order_items: items.filter(item => item.order_id === order.id),
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado
 *       401:
 *         description: Nao autenticado
 */
router.post('/', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { user_id, customer_name, customer_email, total, subtotal, status, payment_method, shipping_address, shipping_cost, discount, items } = req.body;

    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, total, subtotal, status, payment_method, shipping_address, shipping_cost, discount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, customer_name, customer_email, total, subtotal || 0, status || 'pending', payment_method, shipping_address, shipping_cost || 0, discount || 0]
    );

    const orderId = orderResult.insertId;

    if (items && items.length > 0) {
      for (const item of items) {
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, name, image, quantity, price, size, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.name, item.image, item.quantity, item.price, item.size, item.color]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ id: orderId });
  } catch (err) {
    await conn.rollback();
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro interno' });
  } finally {
    conn.release();
  }
});

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Atualizar status do pedido
 *     tags: [Pedidos]
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
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Status atualizado
 *       401:
 *         description: Nao autenticado
 */
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
