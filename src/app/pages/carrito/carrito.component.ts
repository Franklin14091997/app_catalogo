import { Component, OnDestroy, OnInit } from '@angular/core'; // Importa los decoradores de Angular
import { MenuController } from '@ionic/angular'; // Importa el controlador de menú de Ionic
import { Subscription } from 'rxjs'; // Importa Subscription de RxJS para manejar suscripciones
import { Pedido } from 'src/app/models'; // Importa el modelo Pedido
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio CarritoService
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service'; // Importa el servicio FirestoreService

@Component({
  selector: 'app-carrito', // Selector del componente
  templateUrl: './carrito.component.html', // Ruta del template HTML
  styleUrls: ['./carrito.component.scss'], // Ruta de los estilos CSS
})
export class CarritoComponent implements OnInit, OnDestroy {
  
  pedido: Pedido | null = null; // Inicializa el pedido como null
  carritoSuscriber?: Subscription; // Suscripción para el carrito
  total: number=0;
  cantidad: number=0;

  constructor(
    public menucontroller: MenuController,
    public firestoreService: FirestoreService,
    public carritoService: CarritoService,
    public firebaseauthService: FirebaseauthService
  ) {
    this.initCarrito(); // Inicializa el carrito
    this.loadPedido(); // Carga el pedido
  }

  ngOnInit() {} // Método del ciclo de vida que se llama al inicializar el componente

  ngOnDestroy() {
    console.log('ngDestroy() carrito component'); // Mensaje para el ciclo de destrucción
    if (this.carritoSuscriber) {
      this.carritoSuscriber.unsubscribe(); // Desuscribe para evitar fugas de memoria
    }
  }

  openMenu() {
    console.log('open menu'); // Mensaje para abrir el menú
    this.menucontroller.toggle('principal'); // Abre o cierra el menú lateral
  }

  loadPedido() {
    // Carga el pedido desde el carrito
    this.carritoSuscriber = this.carritoService.getCarrito().subscribe((res) => {
      console.log('loadPedido() en carrito', res);
      this.pedido = res; // Asigna la respuesta al pedido
      this.getTotal();
      this.getCantidad();
    });
  }

  initCarrito() {
    // Inicializa el pedido
    this.pedido = {
      id: '',
      cliente: null,
      productos: [],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
  }

  getTotal() {
    this.total = this.pedido?.productos?.reduce((acc, producto) => 
      acc + ((producto.producto?.precioReducido || 0) * producto.cantidad), 0) || 0;
  }
  
  getCantidad() {
    this.cantidad = this.pedido?.productos?.reduce((acc, producto) => 
      acc + producto.cantidad, 0) || 0;
  }
  
  async pedir() {
    if (!this.pedido!.productos.length){
      console.log('añade productos al carrito');
      return;
    }
    if (this.pedido && this.pedido.productos.length > 0) {
      this.pedido.fecha = new Date();
      this.pedido.precioTotal = this.total;
      this.pedido.id = this.firestoreService.getId();
      const uid = await this.firebaseauthService.getUid();
      const path = 'Clientes/' + uid + '/pedidos/'
      this.firestoreService.createDoc(this.pedido, path, this.pedido.id).then( () => {
        console.log('guradado con exito');
        this.carritoService.clearCarrito();
      });
      console.log('pedir() =>', this.pedido, uid, path);
    }
  }

}
