import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-agradecimiento',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './agradecimiento.html',
  styleUrls: ['./agradecimiento.page.scss']
})
export class AgradecimientoPage implements OnInit {
  nombreUsuario: string = 'Usuario';
  numeroPedido: string = '';
  resumenPedido: any[] = [];
  totalPedido: number = 0;
  metodoPago: string = '';
  tipoEntrega: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const db = getFirestore();
      const userDocRef = doc(db, 'usuarios', uid);

      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.nombreUsuario = data['nombre'] + ' ' + (data['apellido'] || '');
        }
      });
    }

    this.route.queryParams.subscribe(params => {
      this.numeroPedido = params['pedidoId'] || '';
      this.metodoPago = params['metodoPago'] || '';
      this.tipoEntrega = params['tipoEntrega'] || '';

      if (this.numeroPedido) {
        this.cargarDetallePedido(this.numeroPedido);
      }
    });
  }

  cargarDetallePedido(pedidoId: string) {
    fetch(`${environment.apiUrl}/pedidos/${pedidoId}/detalle`)

      .then(res => res.json())
      .then(data => {
        console.log('Respuesta del backend:', data);
  
        this.resumenPedido = data.detalles || [];
  
        this.totalPedido = this.resumenPedido.reduce((sum: number, item: any) => {
          const precio = parseFloat(item.precio);
          const cantidad = parseInt(item.cantidad);
          return sum + (isNaN(precio) || isNaN(cantidad) ? 0 : precio * cantidad);
        }, 0);
      })
      .catch(err => {
        console.error('Error al obtener detalle del pedido:', err);
        this.resumenPedido = [];
        this.totalPedido = 0;
      });
  }
  
  

  irAMisPedidos() {
    this.router.navigate(['/mis-pedidos']);
  }
  compartirPorWhatsApp() {
    let mensaje = `🧾 *Pedido #${this.numeroPedido}*%0A`;
    mensaje += `👤 *Cliente:* ${this.nombreUsuario}%0A`;
    mensaje += `📦 *Tipo de entrega:* ${this.tipoEntrega === 'llevar' ? 'Para llevar' : 'En el local'}%0A`;
    mensaje += `💳 *Método de pago:* ${this.metodoPago}%0A%0A`;
  
    mensaje += `🍽️ *Detalle del pedido:*%0A`;
    this.resumenPedido.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}%0A`;
    });
  
    mensaje += `%0A💰 *Total:* S/ ${this.totalPedido.toFixed(2)}`;
  
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
  
}
