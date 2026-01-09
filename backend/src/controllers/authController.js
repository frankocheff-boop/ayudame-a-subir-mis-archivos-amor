const bcrypt = require('bcrypt');
const db = require('../config/db');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');

const SALT_ROUNDS = 10;

async function register(req, res) {
  const { email, password, name, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const pwHash = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const insert = await db.query(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES ($1,$2,$3,$4,$5) RETURNING id,email,name,role',
      [uuidv4(), email, pwHash, name || null, role || 'viewer']
    );
    const user = insert.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    const q = await db.query('SELECT id, email, password_hash, name, role FROM users WHERE email = $1', [email]);
    if (q.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = q.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    // store refresh token
    const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // match REFRESH_TOKEN_EXPIRES_IN
    await db.query('INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES ($1,$2,$3,$4)', [
      uuidv4(),
      user.id,
      refreshToken,
      expiresAt
    ]);

    res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    // verify token signature
    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.userId;

    // check stored token exists and not expired
    const q = await db.query('SELECT id, expires_at FROM refresh_tokens WHERE token = $1 AND user_id = $2', [refreshToken, userId]);
    if (q.rowCount === 0) return res.status(401).json({ error: 'Invalid refresh token' });

    const tokenRow = q.rows[0];
    if (new Date(tokenRow.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    // issue new access token
    const u = await db.query('SELECT id, email, role FROM users WHERE id = $1', [userId]);
    if (u.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    const user = u.rows[0];
    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}

async function logout(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login, refresh, logout };
