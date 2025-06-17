export interface Order {
  id: number;
  productId: number;
  productName: string;
  user: string;
  quantity: number;
  date: string;
  building: string;
  status: 'pendiente' | 'completada' | 'rechazada';
  reason?: string;
}
