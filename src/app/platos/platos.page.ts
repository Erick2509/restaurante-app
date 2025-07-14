import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Plato } from '../models/plato';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './platos.page.html',
  styleUrls: ['./platos.page.scss']
})
export class PlatosPage implements OnInit {
  platos: Plato[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getPlatos().subscribe(data => {
      // Reemplazar 'localhost' por IP local si estás en un móvil físico
      this.platos = data.map(p => ({
        ...p,
        imagenUrl: p.imagenUrl?.replace('localhost', '192.168.51.192') // ⚠️ cambia por tu IP local real
      }));
    });
  }

  verDetalle(plato: Plato) {
    this.router.navigate(['/detalle-plato', plato.id]);
  }
}
