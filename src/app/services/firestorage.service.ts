import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';  // Servicio de almacenamiento de Firebase
import { finalize } from 'rxjs';  // Operador para finalizar observables

@Injectable({
  providedIn: 'root'  // Proveedor global de servicios
})
export class FirestorageService {

  constructor(public storage: AngularFireStorage) { }

  // Método para subir una imagen al almacenamiento de Firebase
  uploadImage(file: any, path: string, nombre: string): Promise<string> {
    return new Promise(resolve => {
      const filePath = path + '/' + nombre;     
      const ref = this.storage.ref(filePath);   
      const task = ref.put(file);               
      
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(res => {  // Obtiene la URL de descarga una vez subida la imagen
            const downloadURL = res;
            resolve(downloadURL);
            return;
          });
        })
      ).subscribe();  // Nos suscribimos a los cambios en la subida de la imagen
    });
  }

}
