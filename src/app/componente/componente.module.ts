import { NgModule } from '@angular/core'; // Importa NgModule para definir el módulo
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar directivas comunes
import { ProductoComponent } from './producto/producto.component'; // Importa el componente Producto
import { IonicModule } from '@ionic/angular'; // Importa IonicModule para usar componentes de Ionic
import { RouterModule } from '@angular/router'; // Importa RouterModule para gestionar rutas
import { ItemcarritoComponent } from './itemcarrito/itemcarrito.component'; // Importa el componente Itemcarrito
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductoComponent, // Declara el componente Producto
    ItemcarritoComponent // Declara el componente Itemcarrito
  ],
  imports: [
    CommonModule, // Importa CommonModule para directivas comunes como ngIf y ngFor
    IonicModule, // Importa IonicModule para usar componentes y directivas de Ionic
    RouterModule, // Importa RouterModule para la navegación en la aplicación
    FormsModule
  ],
  exports: [
    ProductoComponent, // Exporta ProductoComponent para que esté disponible en otros módulos
    ItemcarritoComponent // Exporta ItemcarritoComponent para que esté disponible en otros módulos
  ] 
})
export class ComponenteModule { } // Define el módulo ComponenteModule
