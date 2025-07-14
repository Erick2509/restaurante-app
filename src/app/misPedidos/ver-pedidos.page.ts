import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { getAuth } from 'firebase/auth';
import { RouterModule } from '@angular/router'; // ✅ Importar esto

@Component({
  selector: 'app-ver-pedidos',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule], // ✅ Agregar aquí RouterModule
  templateUrl: './ver-pedidos.page.html',
  styleUrls: ['./ver-pedidos.page.scss']
})
export class VerPedidosPage implements OnInit {
  pedidos: any[] = [];
  cargando: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const clienteId = user.uid;
      this.apiService.getPedidosPorCliente(clienteId).subscribe({
        next: (data) => {
          this.pedidos = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar pedidos:', err);
          this.cargando = false;
        }
      });
    }
  }
  getCardClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'card-pendiente';
      case 'en proceso': return 'card-en-proceso';
      case 'listo': return 'card-listo';
      case 'entregado': return 'card-entregado';
      default: return '';
    }
  }
  
  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'en proceso': return 'estado-en-proceso';
      case 'listo': return 'estado-listo';
      case 'entregado': return 'estado-entregado';
      default: return '';
    }
  }
  
  getColorPorEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'warning';
      case 'en proceso': return 'tertiary';
      case 'listo': return 'success';
      case 'entregado': return 'medium';
      default: return 'primary';
    }
  }
  
  
}
