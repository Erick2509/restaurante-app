import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss']
})
export class DetallePedidoPage implements OnInit {
  pedidoId: number = 0;
  detalle: any[] = [];
  total: number = 0;

  nombreUsuario: string = '';
  metodoPago: string = '';
  tipoEntrega: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pedidoId = +params['id'];
      this.obtenerDetalle();
    });
  }

  obtenerDetalle() {
    this.apiService.getDetallePedido(this.pedidoId).subscribe(response => {
      const pedido = response.pedido;
      this.detalle = response.detalles || [];
      this.total = this.detalle.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

      this.nombreUsuario = pedido?.usuario || 'Usuario';
      this.metodoPago = pedido?.metodoPago || 'Desconocido';
      this.tipoEntrega = pedido?.tipoEntrega || 'llevar';
    });
  }
}
