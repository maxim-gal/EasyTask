import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

// Получить события: свои + публичные чужие
router.get('/', authenticateToken, async (req, res) => {
  const { filter, search } = req.query;
  const userId = req.user.id;

  // Показываем:
  // - свои события (user_id = userId)
  // - ИЛИ чужие, но is_private = false
  let sql = `
    SELECT * FROM events 
    WHERE (user_id = $1 OR is_private = false)
  `;
  const values = [userId];
  let paramIndex = 2;

  if (filter === 'active') {
    sql += ` AND completed = false`;
  } else if (filter === 'completed') {
    sql += ` AND completed = true`;
  }
  if (search && search.trim()) {
    sql += ` AND title ILIKE $${paramIndex}`;
    values.push(`%${search.trim()}%`);
    paramIndex++;
  }
  sql += ` ORDER BY event_date ASC`;

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка получения событий' });
  }
});

// Создать новое событие
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, eventDateTime, priority, is_private, completed } = req.body;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `INSERT INTO events (user_id, title, description, event_date, priority, is_private, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, title, description, eventDateTime, priority || 'medium', is_private || false, completed || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка создания события' });
  }
});

// Обновить событие
router.put('/:id', authenticateToken, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  const { title, description, eventDateTime, priority, is_private, completed } = req.body;
  try {
    // Проверяем, принадлежит ли событие пользователю
    const check = await pool.query('SELECT id FROM events WHERE id = $1 AND user_id = $2', [eventId, userId]);
    if (check.rows.length === 0) {
      return res.status(403).json({ message: 'Нет доступа к событию' });
    }
    const result = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, event_date = $3, priority = $4, is_private = $5, completed = $6, updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, description, eventDateTime, priority, is_private, completed, eventId, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка обновления события' });
  }
});

// Удалить событие
router.delete('/:id', authenticateToken, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2', [eventId, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Событие не найдено или нет доступа' });
    }
    res.json({ message: 'Событие удалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка удаления' });
  }
});

// Переключить статус выполнения (удобно)
router.post('/:id/toggle-complete', authenticateToken, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  try {
    const current = await pool.query('SELECT completed FROM events WHERE id = $1 AND user_id = $2', [eventId, userId]);
    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }
    const newCompleted = !current.rows[0].completed;
    const result = await pool.query(
      'UPDATE events SET completed = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [newCompleted, eventId, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления статуса' });
  }
});

export default router;