import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

// Получить комментарии к событию (с именем автора)
router.get('/:eventId', authenticateToken, async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  try {
    // Проверка доступа к событию: событие должно принадлежать пользователю или быть не приватным? 
    // По логике, приватное событие видит только владелец. Сейчас проверяем владельца.
    const eventCheck = await pool.query('SELECT user_id, is_private FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }
    const event = eventCheck.rows[0];
    if (event.is_private && event.user_id !== userId) {
      return res.status(403).json({ message: 'Нет доступа к комментариям приватного события' });
    }
    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.username as author, u.id as author_id
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.event_id = $1
       ORDER BY c.created_at ASC`,
      [eventId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка получения комментариев' });
  }
});

// Добавить комментарий к событию
router.post('/:eventId', authenticateToken, async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Текст комментария не может быть пустым' });
  }
  try {
    // Проверка доступа (аналогично)
    const eventCheck = await pool.query('SELECT user_id, is_private FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }
    const event = eventCheck.rows[0];
    if (event.is_private && event.user_id !== userId) {
      return res.status(403).json({ message: 'Нельзя комментировать приватное событие' });
    }
    const result = await pool.query(
      `INSERT INTO comments (event_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [eventId, userId, content.trim()]
    );
    // Получаем автора для ответа
    const userRes = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
    const newComment = {
      ...result.rows[0],
      author: userRes.rows[0].username,
      author_id: userId,
    };
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка добавления комментария' });
  }
});

export default router;