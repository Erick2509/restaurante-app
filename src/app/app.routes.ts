import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },  
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: '',
    loadComponent: () => import('./main/main.page').then(m => m.MainPage),
    canActivate: [() =>
      inject(AuthService).estaAutenticado().then(ok => ok || (location.href = '/login', false))
    ],
    children: [
      {
        path: 'platos',
        loadComponent: () => import('./platos/platos.page').then(m => m.PlatosPage)
      },
      {
        path: 'detalle-plato/:id',
        loadComponent: () => import('./detalle-plato/detalle-plato.page').then(m => m.DetallePlatoPage)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./carrito/carrito.page').then(m => m.CarritoPage)
      },
      {
        path: 'agradecimiento',
        loadComponent: () => import('./agradecimiento/agradecimiento.page').then(m => m.AgradecimientoPage)
      },
      {
        path: 'mis-pedidos',
        loadComponent: () => import('./misPedidos/ver-pedidos.page').then(m => m.VerPedidosPage)
      },
      {
        path: 'detalle-pedido/:id',
        loadComponent: () => import('./detalle-pedido/detalle-pedido.page').then(m => m.DetallePedidoPage)
      }

    ]
  }
];
