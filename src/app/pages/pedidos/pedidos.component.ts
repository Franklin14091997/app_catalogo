import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})

export class PedidosComponent implements OnInit, OnDestroy {

  private suscripciones: Subscription[] = [];  // Agrupar las suscripciones
  pedidos: Pedido[] = [];
  pedidosEntregados: Pedido[] = [];
  segmentoActivo: 'nuevos' | 'culminados' = 'nuevos';

  nuevos = true;

  constructor(
    public menucontroller: MenuController,
    public firestoreService: FirestoreService,
    public firebaseauthService: FirebaseauthService
  ) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }

  ngOnDestroy() {
    // Cancelar todas las suscripciones cuando el componente se destruye
    this.suscripciones.forEach(sub => sub.unsubscribe());
    console.log('Desuscrito de todas las suscripciones');
  }

  openMenu() {
    console.log('Abriendo el menú');
    this.menucontroller.toggle('principal');
  }

  changeSegment(ev: any) {
    console.log('Cambiando de segmento:', ev.detail.value);
    this.segmentoActivo = ev.detail.value;

    if (this.segmentoActivo === 'nuevos') {
      this.pedidosEntregados = [];
      this.nuevos = true;
      this.getPedidosNuevos();
    } else {
      this.pedidos = [];
      this.nuevos = false;
      this.getPedidosCulminados();
    }
  }

  // Método para obtener pedidos nuevos (paginación incluida)
  async getPedidosNuevos() {
    const path = 'pedidos';
    let startAt = null;

    if (this.pedidos.length) {
      startAt = this.pedidos[this.pedidos.length - 1].fecha;
      console.log('Paginando desde:', startAt);
    }

    // Cancelar la suscripción anterior si existe
    this.suscripciones.forEach(sub => sub.unsubscribe());
    console.log('Cancelando la suscripción anterior');

    console.log('Cargando pedidos nuevos');
    const suscripcion = this.firestoreService
      .getCollectionAll<Pedido>(path, 'estado', '==', 'enviado', startAt)
      .subscribe(res => {
        console.log('Pedidos nuevos recibidos:', res);
        if (res.length) {
          this.pedidos = [...this.pedidos, ...res];
        } else {
          console.log('No hay más pedidos nuevos');
        }
      });
    this.suscripciones.push(suscripcion);  // Agregar la nueva suscripción
  }

  // Método para obtener pedidos culminados (paginación incluida)
  async getPedidosCulminados() {
    const path = 'pedidos';
    let startAt = null;

    if (this.pedidosEntregados.length) {
      startAt = this.pedidosEntregados[this.pedidosEntregados.length - 1].fecha;
      console.log('Paginando desde:', startAt);
    }

    // Cancelar la suscripción anterior si existe
    this.suscripciones.forEach(sub => sub.unsubscribe());
    console.log('Cancelando la suscripción anterior');

    console.log('Cargando pedidos culminados');
    const suscripcion = this.firestoreService
      .getCollectionAll<Pedido>(path, 'estado', '==', 'entregado', startAt)
      .subscribe(res => {
        console.log('Pedidos entregados recibidos:', res);
        if (res.length) {
          this.pedidosEntregados = [...this.pedidosEntregados, ...res];
        } else {
          console.log('No hay más pedidos entregados');
        }
      });
    this.suscripciones.push(suscripcion);  // Agregar la nueva suscripción
  }

  cargarMas() {
    console.log('Cargando más pedidos');
    if (this.segmentoActivo === 'nuevos') {
      this.getPedidosNuevos();
    } else {
      this.getPedidosCulminados();
    }
  }
}
