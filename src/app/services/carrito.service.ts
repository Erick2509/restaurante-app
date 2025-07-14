import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Plato } from '../models/plato';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<Plato[]>(this.obtenerCarritoDesdeStorage());
  carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  private obtenerCarritoDesdeStorage(): Plato[] {
    const data = localStorage.getItem('carrito');
    return data ? JSON.parse(data) : [];
  }

  private guardarCarritoEnStorage(carrito: Plato[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    this.carritoSubject.next(carrito);
  }

  agregarAlCarrito(plato: Plato) {
    const carrito = this.obtenerCarritoDesdeStorage();
    const index = carrito.findIndex(p => p.id === plato.id);

    if (index >= 0 && carrito[index]) {
      carrito[index].cantidad = (carrito[index].cantidad || 0) + (plato.cantidad || 1);
    } else {
      carrito.push({ ...plato, cantidad: plato.cantidad || 1 });
    }

    this.guardarCarritoEnStorage(carrito);
  }

  obtenerCarrito(): Plato[] {
    return this.obtenerCarritoDesdeStorage();
  }

  eliminarDelCarrito(id: number) {
    const carrito = this.obtenerCarritoDesdeStorage().filter(item => item.id !== id);
    this.guardarCarritoEnStorage(carrito);
  }

  vaciarCarrito() {
    this.guardarCarritoEnStorage([]);
  }

  obtenerCantidadTotal(): number {
    const carrito = this.obtenerCarritoDesdeStorage();
    return carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  }
  incrementarCantidad(id: number) {
    const carrito = this.obtenerCarritoDesdeStorage();
    const index = carrito.findIndex(p => p.id === id);
    if (index >= 0) {
      carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
      this.guardarCarritoEnStorage(carrito);
    }
  }
  
  disminuirCantidad(id: number) {
    const carrito = this.obtenerCarritoDesdeStorage();
    const index = carrito.findIndex(p => p.id === id);
    if (index >= 0) {
      const cantidadActual = carrito[index].cantidad ?? 1;
  
      if (cantidadActual > 1) {
        carrito[index].cantidad = cantidadActual - 1;
      } else {
        carrito.splice(index, 1);
      }
  
      this.guardarCarritoEnStorage(carrito);
    }
  }
  
  
  
}
