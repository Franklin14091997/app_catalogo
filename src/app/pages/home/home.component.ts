import { Component, OnInit } from '@angular/core';  // Importa los decoradores de Angular
import { MenuController } from '@ionic/angular';  // Importa el controlador de menú de Ionic
import { Producto } from 'src/app/models';  // Importa el modelo Producto
import { FirestoreService } from 'src/app/services/firestore.service';  // Importa el servicio de Firestore

@Component({
  selector: 'app-home',  // Selector del componente
  templateUrl: './home.component.html',  // Ruta del template HTML
  styleUrls: ['./home.component.scss'],  // Ruta de los estilos CSS
})
export class HomeComponent implements OnInit {

  private path = 'productos/';  // Ruta de la colección de productos en Firestore

  productos: Producto[] = [];  // Arreglo para almacenar los productos

  constructor(public menucontroller: MenuController,
              public firestoreService: FirestoreService) {
    this.loadProductos();  // Carga los productos al crear el componente
  }

  ngOnInit() {}

  openMenu() {
    console.log('open menu');  // Mensaje para abrir el menú
    this.menucontroller.toggle('principal');  // Abre o cierra el menú lateral
  }

  loadProductos() {
    // Carga los productos desde Firestore
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
      this.productos = res;  // Asigna la respuesta a la lista de productos
    });
  }
}
