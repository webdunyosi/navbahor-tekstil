import type { Product } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`);
  if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`);
  return res.json() as Promise<Product[]>;
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST /api/products failed: ${res.status}`);
  return res.json() as Promise<Product>;
}

export async function updateProduct(id: number, data: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT /api/products/${id} failed: ${res.status}`);
  return res.json() as Promise<Product>;
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`DELETE /api/products/${id} failed: ${res.status}`);
}