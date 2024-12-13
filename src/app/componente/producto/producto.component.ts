import { Component, Input, OnInit } from '@angular/core'; // Importa componentes necesarios
import { ModalController } from '@ionic/angular';
import { ComentariosComponent } from 'src/app/comentarios/comentarios.component';
import { Producto } from 'src/app/models'; // Importa el modelo Producto
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio CarritoService

@Component({
  selector: 'app-producto', // Selector del componente
  templateUrl: './producto.component.html', // Ruta al archivo HTML del componente
  styleUrls: ['./producto.component.scss'], // Ruta al archivo SCSS del componente
})
export class ProductoComponent implements OnInit {

  @Input() producto?: Producto; // Recibe un producto como input

  constructor(public carritoService: CarritoService,
              public modalController: ModalController) { }

  ngOnInit() {
    // Método que se llama al inicializar el componente
  }

  addCarrito() {
    console.log('addCarrito()'); // Mensaje de depuración
    this.carritoService.addProducto(this.producto!); // Agrega el producto al carrito
  }

  async openModel() {
    const modal = await this.modalController.create({
      component: ComentariosComponent,
      componentProps: { producto: this.producto } // Cambio realizado aquí
    });
    return await modal.present();
  }
  
}
