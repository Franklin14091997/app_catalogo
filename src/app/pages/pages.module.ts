import { NgModule } from '@angular/core';  // Importa NgModule de Angular core
import { CommonModule } from '@angular/common';  // Importa funcionalidades comunes de Angular
import { HomeComponent } from './home/home.component';  // Importa el componente Home
import { IonicModule } from '@ionic/angular';  // Importa Ionic para usar sus componentes y directivas
import { RouterModule } from '@angular/router';  // Importa RouterModule para gestionar la navegación
import { PerfilComponent } from './perfil/perfil.component';  // Importa el componente de perfil
import { FormsModule } from '@angular/forms';  // Importa FormsModule para manejar formularios
import { ComponenteModule } from '../componente/componente.module';  // Importa un módulo de componentes adicional
import { CarritoComponent } from './carrito/carrito.component';  // Importa el componente de carrito
import { MispedidosComponent } from './mispedidos/mispedidos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ComentariosComponent } from '../comentarios/comentarios.component';
import { GooglemapsComponent } from '../googlemaps/googlemaps.component';

@NgModule({
  declarations: [
    HomeComponent,  // Declara el componente Home
    PerfilComponent,  // Declara el componente de perfil
    CarritoComponent,  // Declara el componente de carrito
    MispedidosComponent,
    PedidosComponent,
    ComentariosComponent,
    GooglemapsComponent
  ],
  imports: [
    CommonModule,  // Importa el módulo común
    IonicModule,  // Importa Ionic para componentes de la interfaz
    RouterModule,  // Importa el módulo de rutas
    FormsModule,  // Importa el módulo de formularios
    ComponenteModule  // Importa otro módulo de componentes
  ]
})
export class PagesModule { }  // Exporta el módulo PagesModule
