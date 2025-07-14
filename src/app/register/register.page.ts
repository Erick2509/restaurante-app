// 📁 File: src/app/register/register.page.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  nombre = '';
  apellido = '';
  correo = '';
  telefono = '';
  password = '';
  confirmarPassword = '';
  mensaje = '';

  private auth = getAuth();
  private firestore = getFirestore();

  constructor(private router: Router) {}

  async registrar() {
    if (this.password !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(this.auth, this.correo, this.password);

      // ✉️ Enviar correo de verificación
      await sendEmailVerification(cred.user);

      // 📂 Guardar en Firestore
      await setDoc(doc(this.firestore, 'usuarios', cred.user.uid), {
        uid: cred.user.uid,
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        telefono: this.telefono,
        creadoEn: new Date()
      });

      this.mensaje = 'Registro exitoso. Verifica tu correo electrónico antes de iniciar sesión.';

      // Redirigir después de unos segundos
      setTimeout(() => this.router.navigate(['/login']), 3000);

    } catch (error) {
      this.mensaje = 'Error al registrar: ' + (error as any).message;
    }
  }
  irALogin() {
    this.router.navigate(['/login']);
  }
}
