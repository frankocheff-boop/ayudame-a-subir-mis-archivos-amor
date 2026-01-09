const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function listReservations(req, res) {
  try {
    const q = await db.query('SELECT * FROM reservations ORDER BY start_date ASC LIMIT 200');
    res.json({ reservations: q.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function createReservation(req, res) {
  const { name, start_date, end_date, villa_type, nights, data } = req.body;
  try {
    const id = uuidv4();
    await db.query(
      `INSERT INTO reservations (id,name,start_date,end_date,villa_type,nights,data) 
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, name, start_date, end_date, villa_type || null, nights || null, data || {}]
    );
    const q = await db.query('SELECT * FROM reservations WHERE id = $1', [id]);
    res.status(201).json({ reservation: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function updateReservation(req, res) {
  const { id } = req.params;
  const { name, start_date, end_date, villa_type, nights, data } = req.body;
  try {
    await db.query(
      `UPDATE reservations SET name=$1,start_date=$2,end_date=$3,villa_type=$4,nights=$5,data=$6,updated_at=now() WHERE id=$7`,
      [name, start_date, end_date, villa_type, nights, data || {}, id]
    );
    const q = await db.query('SELECT * FROM reservations WHERE id = $1', [id]);
    if (q.rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ reservation: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function deleteReservation(req, res) {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM reservations WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

module.exports = {
  listReservations,
  createReservation,
  updateReservation,
  deleteReservation
};
