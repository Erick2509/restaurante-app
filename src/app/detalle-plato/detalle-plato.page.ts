import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Plato } from '../models/plato';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { CarritoService } from '../services/carrito.service'; // ✅ Importación correcta

@Component({
  selector: 'app-detalle-plato',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './detalle-plato.page.html',
  styleUrls: ['./detalle-plato.page.scss']
})
export class DetallePlatoPage implements OnInit {
  plato!: Plato;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private carritoService: CarritoService // ✅ Ahora correcto
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getPlatoPorId(id).subscribe(data => {
      this.plato = data;
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async realizarPedido() {
    this.carritoService.agregarAlCarrito({
      id: this.plato.id,
      nombre: this.plato.nombre,
      descripcion: this.plato.descripcion,
      precio: this.plato.precio,
      imagenUrl: this.plato.imagenUrl,
      cantidad: 1
    });

    const toast = await this.toastCtrl.create({
      message: 'Plato agregado al carrito',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }
}
