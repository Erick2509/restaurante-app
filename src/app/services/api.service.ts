import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plato } from '../models/plato';
import { Pedido } from '../models/pedido';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todos los platos
  getPlatos(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.baseUrl}/platos`);
  }

  // Obtener un plato por su ID
  getPlatoPorId(id: number): Observable<Plato> {
    return this.http.get<Plato>(`${this.baseUrl}/platos/${id}`);
  }

  // Crear un nuevo pedido
  crearPedido(pedido: Pedido): Observable<any> {
    return this.http.post(`${this.baseUrl}/pedidos`, pedido);
  }

  // Obtener pedidos por cliente
  getPedidosPorCliente(clienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pedidos/cliente/${clienteId}`);
  }

  // Obtener mesas disponibles
  getMesasDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mesas/disponibles`);
  }

  // Obtener mozos disponibles
  getMozosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mozos/disponibles`);
  }

  // ✅ Obtener detalle del pedido por ID (corregido)
  getDetallePedido(id: number): Observable<{ pedido: any, detalles: any[] }> {
    return this.http.get<{ pedido: any, detalles: any[] }>(`${this.baseUrl}/pedidos/${id}/detalle`);
  }
}
