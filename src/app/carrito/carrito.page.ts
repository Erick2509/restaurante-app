import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { ApiService } from '../services/api.service';
import { Plato } from '../models/plato';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss']
})
export class CarritoPage implements OnInit {
  carrito: Plato[] = [];
  total: number = 0;
  tipoEntrega: 'local' | 'llevar' = 'llevar';
  mesas: any[] = [];
  mozos: any[] = [];
  mesaSeleccionada: number | null = null;
  mozoSeleccionado: number | null = null;
  metodoPago: string = '';

  constructor(
    private apiService: ApiService,
    private carritoService: CarritoService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(data => {
      this.carrito = data;
      this.total = data.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);
    });
  }

  eliminarDelCarrito(id: number) {
    this.carritoService.eliminarDelCarrito(id);
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
  }

  cargarMesasYMozos() {
    this.apiService.getMesasDisponibles().subscribe(data => this.mesas = data);
    this.apiService.getMozosDisponibles().subscribe(data => this.mozos = data);
  }
  incrementar(id: number) {
    this.carritoService.incrementarCantidad(id);
  }
  
  disminuir(id: number) {
    this.carritoService.disminuirCantidad(id);
  }
  

  onTipoEntregaChange() {
    if (this.tipoEntrega === 'local') {
      this.cargarMesasYMozos();
    } else {
      this.mesaSeleccionada = null;
      this.mozoSeleccionado = null;
    }
  }

  async confirmarPedido() {
    const uid = localStorage.getItem('uid');
    if (!uid) {
      const toast = await this.toastCtrl.create({
        message: 'Usuario no autenticado',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    if (!this.metodoPago) {
      const toast = await this.toastCtrl.create({
        message: 'Selecciona un método de pago',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const pedido = {
      clienteId: uid,
      mesaId: this.tipoEntrega === 'local' ? this.mesaSeleccionada : null,
      mozoId: this.tipoEntrega === 'local' ? this.mozoSeleccionado : null,
      estado: 'pendiente',
      metodoPago: this.metodoPago,
      total: this.total,
      tipoEntrega: this.tipoEntrega,
      platos: this.carrito.map(p => ({
        platoId: p.id,
        cantidad: p.cantidad || 1,
      }))
    };

    const metodoPagoTemp = this.metodoPago;
    const tipoEntregaTemp = this.tipoEntrega;

    this.apiService.crearPedido(pedido).subscribe({
      next: async (response) => {
        this.carritoService.vaciarCarrito();

        const toast = await this.toastCtrl.create({
          message: 'Pedido confirmado',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        this.router.navigate(['/agradecimiento'], {
          queryParams: {
            pedidoId: response.pedidoId,
            metodoPago: metodoPagoTemp,
            tipoEntrega: tipoEntregaTemp,
            total: pedido.total
          }
        });
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Error al confirmar el pedido',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
