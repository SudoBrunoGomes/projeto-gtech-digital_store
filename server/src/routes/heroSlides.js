import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

/**
 * @swagger
 * /api/hero-slides:
 *   get:
 *     summary: Listar slides/banners ativos
 *     tags: [Hero Slides]
 *     responses:
 *       200:
 *         description: Lista de slides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HeroSlide'
 */
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hero_slides WHERE active = true ORDER BY position ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/hero-slides:
 *   post:
 *     summary: Criar slide/banner
 *     tags: [Hero Slides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HeroSlideInput'
 *     responses:
 *       201:
 *         description: Slide criado
 *       401:
 *         description: Nao autenticado
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tag, title, description, button_text, button_link, image, bg_color, bg_dark, position } = req.body;
    const [result] = await pool.query(
      `INSERT INTO hero_slides (tag, title, description, button_text, button_link, image, bg_color, bg_dark, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tag, title, description, button_text, button_link, image, bg_color || 'bg-[#F5F5F5]', bg_dark || 'dark:bg-gray-900/50', position || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar slide:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   put:
 *     summary: Atualizar slide/banner
 *     tags: [Hero Slides]
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
 *             $ref: '#/components/schemas/HeroSlideInput'
 *     responses:
 *       200:
 *         description: Slide atualizado
 *       401:
 *         description: Nao autenticado
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { tag, title, description, button_text, button_link, image, bg_color, bg_dark } = req.body;
    await pool.query(
      `UPDATE hero_slides SET tag=?, title=?, description=?, button_text=?, button_link=?, image=?, bg_color=?, bg_dark=?
       WHERE id=?`,
      [tag, title, description, button_text, button_link, image, bg_color, bg_dark, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   delete:
 *     summary: Deletar slide/banner
 *     tags: [Hero Slides]
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
 *         description: Slide deletado
 *       401:
 *         description: Nao autenticado
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM hero_slides WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
