export interface Product {
  id: number;
  name: string;       // Maxsulot nomi
  model: string;      // Maxsulot modeli
  note: string;       // Izoh
  unit: string;       // O'lchov birligi
  quantity: number;   // Soni
  department: string; // Bo'limi
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