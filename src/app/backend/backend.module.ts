import { NgModule } from '@angular/core'; // Importa NgModule para definir el módulo
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar directivas comunes
import { SetProductosComponent } from './set-productos/set-productos.component'; // Importa el componente SetProductos
import { IonicModule } from '@ionic/angular'; // Importa IonicModule para utilizar componentes de Ionic
import { FormsModule } from '@angular/forms'; // Importa FormsModule para utilizar formularios

@NgModule({
  declarations: [
    SetProductosComponent // Declara el componente SetProductos en este módulo
  ],
  imports: [
    CommonModule, // Importa CommonModule para utilizar directivas y pipes comunes
    IonicModule, // Importa IonicModule para utilizar componentes de Ionic
    FormsModule // Importa FormsModule para utilizar formularios en el módulo
  ]
})
export class BackendModule { } // Exporta el BackendModule
