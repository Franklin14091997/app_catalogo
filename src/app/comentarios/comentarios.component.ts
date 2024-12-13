import { Component, Input, OnDestroy, OnInit } from '@angular/core'; // Cambiado input -> Input
import { ModalController } from '@ionic/angular';
import { Cliente, Producto } from '../models';
import { FirestoreService } from '../services/firestore.service';
import { Subscription } from 'rxjs';
import { FirebaseauthService } from '../services/firebaseauth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit, OnDestroy {

  @Input() producto?: Producto; // Correcto: producto es una entrada opcional de tipo Producto

  comentario = '';
  comentarios?: Comentario[] = [];
  suscriber?: Subscription;
  suscriberUserInfo?: Subscription;

  constructor(public modalcontroller: ModalController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService
  ) { }

  ngOnDestroy() {
    console.log('ngOnDestroy() modal');
    if(this.suscriber){
      this.suscriber.unsubscribe;
    }
  }

  ngOnInit() {
    console.log('producto', this.producto);
    this.loadComentario();
  }

  closeModal() {
    this.modalcontroller.dismiss();
  }

  loadComentario(){
    let starAt = null;
    if (this.comentarios?.length){
      starAt = this.comentarios[this.comentarios.length -1].fecha;
    }
    const path = 'productos/' + this.producto?.id + '/comentarios';
    this.suscriber = this.firestoreService.getCollectionPaginada<Comentario>(path, 1, starAt).subscribe( res => {
      if (res.length){
          res.forEach( comentario => {
            const exist = this.comentarios?.find(comentExist =>{
              comentExist.id === comentario.id;
            });
            if (exist === undefined){
              this.comentarios?.push(comentario)
            }
          });
          // this.comentarios = res;
          // console.log(res);
      }
    });
  }

  async comentar(){
    const comentario = this.comentario;
    console.log('comentario ->', comentario);
  
    let path = '/Clientes/';
    const uid = await this.firebaseauthService.getUid();
    
    // Validamos que uid no sea null
    if (uid === null) {
      console.error('No se pudo obtener el UID del usuario');
      return;  // Salimos de la función si el uid es null
    }
  
    console.log('Obteniendo información del usuario');
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res => {
      if (res !== undefined) {
        const data: Comentario = {
          autor: res.nombre,
          comentario: comentario,
          fecha: new Date(),
          id: this.firestoreService.getId()
        };
  
        // Verificamos que this.producto?.id no sea null o undefined
        if (this.producto && this.producto.id) {
          path = 'productos/' + this.producto.id + '/comentarios';
  
          this.firestoreService.createDoc(data, path, data.id).then(() => {
            console.log('comentado enviado');
            this.comentario = '';      
          });
        } else {
          console.error('El ID del producto no está disponible');
        }
      }
    });
  }
  

}


interface Comentario {
    autor: string;
    comentario: string;
    fecha: any;
    id: string;
}