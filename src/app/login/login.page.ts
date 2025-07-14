import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  correo = '';
  password = '';
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  async ingresar(form: NgForm) {
    // ✅ Si el formulario es inválido, detener
    if (!form.valid) {
      this.mensaje = 'Completa todos los campos correctamente.';
      return;
    }

    try {
      await this.authService.login(this.correo, this.password);
      this.mensaje = '';
      this.router.navigate(['/platos']);
    } catch (error) {
      this.mensaje = (error as any).message || 'Error al iniciar sesión.';
    }
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}
