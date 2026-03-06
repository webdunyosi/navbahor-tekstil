export interface Product {
  id: number;
  name: string;       // Maxsulot nomi
  bukum?: number;     // Tokchadagi o'rni (shelf number)
  model: string;      // Maxsulot modeli
  note: string;       // Izoh
  unit: string;       // O'lchov birligi
  quantity: number;   // Soni
  department: string; // Bo'limi
  image?: string;     // Rasm yo'li
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  products: Product[];
}

export interface User {
  id: number | string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}