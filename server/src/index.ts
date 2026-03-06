import express, { Request, Response } from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../../data');
const DATA_FILE = resolve(DATA_DIR, 'products.json');

interface Product {
  id: number;
  name: string;
  name_ru?: string;
  name_tr?: string;
  bukum?: number;
  model: string;
  note: string;
  unit: string;
  quantity: number;
  department: string;
  image?: string;
}

function ensureDataFile(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

function readProducts(): Product[] {
  ensureDataFile();
  const content = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(content) as Product[];
}

function writeProducts(products: Product[]): void {
  ensureDataFile();
  const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
  writeFileSync(tmp, JSON.stringify(products, null, 2), 'utf-8');
  renameSync(tmp, DATA_FILE);
}

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/products
app.get('/api/products', (_req: Request, res: Response) => {
  const products = readProducts();
  res.json(products);
});

// POST /api/products
app.post('/api/products', (req: Request, res: Response) => {
  const products = readProducts();
  const body = req.body as Omit<Product, 'id'>;
  const newId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const newProduct: Product = { id: newId, ...body };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
app.put('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const updated: Product = { ...(req.body as Omit<Product, 'id'>), id };
  products[index] = updated;
  writeProducts(products);
  res.json(updated);
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  products.splice(index, 1);
  writeProducts(products);
  res.status(204).send();
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});