import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Servicio de autenticación de Firebase
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Cliente } from '../models';

@Injectable({
  providedIn: 'root'  // Proveedor global de servicios
})
export class FirebaseauthService {

  datosCliente?: Cliente;

  constructor(public auth: AngularFireAuth,
              private firestoreService: FirestoreService
  ) {
    this.stateUser();
  }

  stateUser(){
    this.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.getInfoUser();
      }
    });
  }

  // Método para iniciar sesión con email y contraseña
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Método para cerrar sesión
  logout() {
    return this.auth.signOut();
  }

  // Método para registrar un nuevo usuario con email y contraseña
  registrar(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // Método para obtener el UID del usuario actualmente autenticado
  getUid(): Promise<string | null> {
    return this.auth.currentUser.then(user => user ? user.uid : null);
  }

  // Observa el estado de autenticación del usuario
  stateAuth(): Observable<any> {
    return this.auth.authState;
  }

  async getInfoUser() {
    const uid = await this.getUid();
    if (uid !== null) {
      const path = 'Clientes';
      this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res => {
        if (res !== undefined) {
          this.datosCliente = res;
          console.log('datosCliente =>', this.datosCliente);
          
        }
      });
    } else {
      console.log("UID es null, no se puede obtener la información del usuario.");
    }
  }
  
}
