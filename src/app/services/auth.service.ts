// 📁 src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { environment } from '../../environments/environment';

const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  // Registrar usuario con correo verificado
  async registrarUsuario(usuario: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    password: string;
  }): Promise<void> {
    const cred = await createUserWithEmailAndPassword(auth, usuario.correo, usuario.password);

    // Enviar verificación por correo
    await sendEmailVerification(cred.user);

    // Guardar en Firestore
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      creadoEn: new Date()
    });

    // Guardar temporalmente UID
    localStorage.setItem('uid', cred.user.uid);
  }

  // Iniciar sesión y guardar uid
  async login(correo: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(auth, correo, password);
    if (!cred.user.emailVerified) {
      throw new Error('Debes verificar tu correo antes de ingresar.');
    }
    localStorage.setItem('uid', cred.user.uid);
  }

  // Cerrar sesión
  logout(): void {
    signOut(auth).then(() => {
      localStorage.removeItem('uid');
      this.router.navigate(['/login']);
    });
  }

  // Validar si el usuario está autenticado y verificado
  estaAutenticado(): Promise<boolean> {
    return new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe(); // evitar múltiples llamadas

        if (user && user.emailVerified) {
          localStorage.setItem('uid', user.uid);
          resolve(true);
        } else {
          localStorage.removeItem('uid');
          resolve(false);
        }
      });
    });
  }

  // Obtener datos del usuario desde Firestore
  async obtenerUsuario(): Promise<any> {
    const uid = localStorage.getItem('uid');
    if (!uid) return null;

    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }
}
