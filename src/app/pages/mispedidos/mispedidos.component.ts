import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent  implements OnInit, OnDestroy {

  nuevoSuscriber?: Subscription;
  culminadoSuscriber?: Subscription;
  pedidos: Pedido[] = [];

  constructor(
    public menucontroller: MenuController,
    public firestoreService: FirestoreService,
    public firebaseauthService: FirebaseauthService
  ) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }
  ngOnDestroy() {
    if (this.nuevoSuscriber){
      this.nuevoSuscriber.unsubscribe();
    }
    if (this.culminadoSuscriber){
      this.culminadoSuscriber.unsubscribe();
    }
  }

  openMenu() {
    console.log('open menu'); // Mensaje para abrir el menú
    this.menucontroller.toggle('principal'); // Abre o cierra el menú lateral
  }

  changeSegment(ev: any){
    // console.log('changeSegment()', ev.detail.value);
    const opc = ev.detail.value;
    if (opc === 'culminados' ){
        this.getPedidosCulminados();
    }
    if (opc === 'nuevos') {
        this.getPedidosNuevos();
    }
  }

  async getPedidosNuevos(){
    console.log('getPedidosNuevos()');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/'
    this.nuevoSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'enviado').subscribe(res => {
          if ( res.length){
            console.log('getPedidosNuevos() -> res', res);
            
                this.pedidos = res;
          }
    });
  }

  async getPedidosCulminados(){
    console.log('getPedidosCulminados()');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/'
    this.culminadoSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'entregado').subscribe(res => {
          if ( res.length){
            console.log('getPedidosCulminados() ->', res);
            this.pedidos = res;
          }
    });
    
  }
}
