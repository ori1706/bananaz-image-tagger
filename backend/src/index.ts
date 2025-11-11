import express from 'express';
import cors from 'cors';
import { ulid } from 'ulid';
import { users, images, threads } from './storage';
import { User, Image, Thread } from './types';
import { authMiddleware, AuthRequest } from './middleware';
import { sanitize } from './sanitizer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public endpoints
app.post('/users', (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const sanitizedName = sanitize(name.trim());

  // Check if user already exists
  const existingUser = users.find(u => u.name === sanitizedName);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user: User = {
    id: ulid(),
    name: sanitizedName
  };

  users.push(user);
  res.status(201).json(user);
});

app.post('/login', (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const user = users.find(u => u.name === name.trim());
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.status(200).json({ message: 'Login successful', user });
});

// Protected endpoints
app.get('/users', authMiddleware, (req: AuthRequest, res) => {
  res.json(users);
});

app.post('/images', authMiddleware, (req: AuthRequest, res) => {
  // Generate a random image ID from picsum (0-1000)
  const randomId = Math.floor(Math.random() * 1000);
  
  const image: Image = {
    id: ulid(),
    url: `https://picsum.photos/id/${randomId}/800/600`,
    createdBy: req.username!
  };

  images.push(image);
  res.status(201).json(image);
});

app.get('/images', authMiddleware, (req: AuthRequest, res) => {
  res.json(images);
});

app.post('/images/:id/threads', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { x, y, comment } = req.body;

  // Validate image exists
  const image = images.find(img => img.id === id);
  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Validate input
  if (typeof x !== 'number' || typeof y !== 'number' || !comment || typeof comment !== 'string') {
    return res.status(400).json({ error: 'Invalid thread data. x, y must be numbers and comment must be a string' });
  }

  const sanitizedComment = sanitize(comment);

  const thread: Thread = {
    id: ulid(),
    imageId: id,
    x,
    y,
    comment: sanitizedComment,
    createdBy: req.username!
  };

  threads.push(thread);
  res.status(201).json(thread);
});

app.get('/images/:id/threads', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params;

  // Validate image exists
  const image = images.find(img => img.id === id);
  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }

  const imageThreads = threads.filter(t => t.imageId === id);
  res.json(imageThreads);
});

app.delete('/threads/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params;

  const threadIndex = threads.findIndex(t => t.id === id);
  if (threadIndex === -1) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  const thread = threads[threadIndex];
  if (thread.createdBy !== req.username) {
    return res.status(403).json({ error: 'You can only delete your own threads' });
  }

  threads.splice(threadIndex, 1);
  res.status(204).send();
});

// Bonus: Image deletion
app.delete('/images/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params;

  const imageIndex = images.findIndex(img => img.id === id);
  if (imageIndex === -1) {
    return res.status(404).json({ error: 'Image not found' });
  }

  const image = images[imageIndex];
  if (image.createdBy !== req.username) {
    return res.status(403).json({ error: 'You can only delete your own images' });
  }

  // Delete associated threads
  const threadIndexes = threads
    .map((t, idx) => t.imageId === id ? idx : -1)
    .filter(idx => idx !== -1)
    .reverse(); // Reverse to delete from end to avoid index issues

  threadIndexes.forEach(idx => threads.splice(idx, 1));
  
  images.splice(imageIndex, 1);
  res.status(204).send();
});

// Bonus: Update thread position (for draggable pins)
app.patch('/threads/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { x, y } = req.body;

  const thread = threads.find(t => t.id === id);
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  if (thread.createdBy !== req.username) {
    return res.status(403).json({ error: 'You can only update your own threads' });
  }

  if (typeof x === 'number') {
    thread.x = x;
  }
  if (typeof y === 'number') {
    thread.y = y;
  }

  res.json(thread);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

