import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { CarritoService } from '../services/carrito.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { cart, cartOutline } from 'ionicons/icons';
addIcons({ cart, cartOutline });
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  
})
export class MainPage implements OnInit, OnDestroy {
  nombreUsuario: string = 'Invitado';
  totalCarrito: number = 0;
  private carritoSub!: Subscription;
  

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.authService.obtenerUsuario().then(usuario => {
      if (usuario) {
        this.nombreUsuario = usuario.nombre || usuario.apellido || 'Usuario';
      }
    });

    this.carritoSub = this.carritoService.carrito$.subscribe(carrito => {
      this.totalCarrito = carrito.reduce((total, p) => total + (p.cantidad || 1), 0);
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.carritoSub?.unsubscribe();
  }
}
