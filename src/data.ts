export type Category = 'Grocery' | 'Vegetables' | 'Fruits';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const PRODUCTS: Product[] = [
  // Vegetables
  { id: 'v1', name: 'Fresh Tomatoes', price: 150, category: 'Vegetables', image: '🍅' },
  { id: 'v2', name: 'Potatoes', price: 80, category: 'Vegetables', image: '🥔' },
  { id: 'v3', name: 'Onions', price: 120, category: 'Vegetables', image: '🧅' },
  { id: 'v4', name: 'Carrots', price: 100, category: 'Vegetables', image: '🥕' },
  { id: 'v5', name: 'Broccoli', price: 250, category: 'Vegetables', image: '🥦' },
  { id: 'v6', name: 'Spinach', price: 60, category: 'Vegetables', image: '🥬' },
  { id: 'v7', name: 'Capsicum', price: 200, category: 'Vegetables', image: '🫑' },
  { id: 'v8', name: 'Cucumber', price: 80, category: 'Vegetables', image: '🥒' },
  { id: 'v9', name: 'Garlic', price: 400, category: 'Vegetables', image: '🧄' },
  { id: 'v10', name: 'Eggplant', price: 100, category: 'Vegetables', image: '🍆' },
  
  // Fruits
  { id: 'f1', name: 'Apples', price: 300, category: 'Fruits', image: '🍎' },
  { id: 'f2', name: 'Bananas', price: 150, category: 'Fruits', image: '🍌' },
  { id: 'f3', name: 'Oranges', price: 200, category: 'Fruits', image: '🍊' },
  { id: 'f4', name: 'Mangoes', price: 400, category: 'Fruits', image: '🥭' },
  { id: 'f5', name: 'Grapes', price: 350, category: 'Fruits', image: '🍇' },
  { id: 'f6', name: 'Strawberry', price: 500, category: 'Fruits', image: '🍓' },
  { id: 'f7', name: 'Watermelon', price: 150, category: 'Fruits', image: '🍉' },
  { id: 'f8', name: 'Pineapple', price: 350, category: 'Fruits', image: '🍍' },
  { id: 'f9', name: 'Papaya', price: 200, category: 'Fruits', image: '🥥' },
  { id: 'f10', name: 'Cherries', price: 600, category: 'Fruits', image: '🍒' },
  
  // Grocery
  { id: 'g1', name: 'Rice (1kg)', price: 450, category: 'Grocery', image: '🍚' },
  { id: 'g2', name: 'Wheat Flour (5kg)', price: 800, category: 'Grocery', image: '🌾' },
  { id: 'g3', name: 'Cooking Oil (1L)', price: 550, category: 'Grocery', image: '🛢️' },
  { id: 'g4', name: 'Sugar (1kg)', price: 150, category: 'Grocery', image: '🧂' },
  { id: 'g5', name: 'Milk (1L)', price: 220, category: 'Grocery', image: '🥛' },
  { id: 'g6', name: 'Eggs (1 Dozen)', price: 350, category: 'Grocery', image: '🥚' },
  { id: 'g7', name: 'Bread', price: 120, category: 'Grocery', image: '🍞' },
  { id: 'g8', name: 'Butter', price: 300, category: 'Grocery', image: '🧈' },
  { id: 'g9', name: 'Cheese Block', price: 650, category: 'Grocery', image: '🧀' },
  { id: 'g10', name: 'Tea Pack', price: 420, category: 'Grocery', image: '☕' },
  { id: 'g11', name: 'Honey', price: 750, category: 'Grocery', image: '🍯' },
];
