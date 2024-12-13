import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Producto } from 'src/app/models'; // Asegúrate de que la ruta sea correcta
import { FirestorageService } from 'src/app/services/firestorage.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  productos: Producto[] = [];


  newProducto: Producto = { // Inicializamos 'newProducto' con la interfaz 'Productos'
    nombre: '',
    precioNormal: null,
    precioReducido: null,
    foto: '',
    id: this.firestoreService.getId(),
    fecha: new Date()
  };

  enableNewProducto = false;

  private path = 'productos/';

  newImage = '';
  newFile = '';

  loading: any;

  constructor(public menuController: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getProductos();
  }

  openMenu() {
    console.log('open menu');
    this.menuController.toggle('principal');
  }

  async guardarProducto() {
    this.presentLoanding();
    const path = 'Producto';
    const name = this.newProducto.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.newProducto.foto = res;
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then(res => {
        this.loading.dismiss();
        this.presentToast('Guardado con exito');
    }).catch(error => {
        this.presentToast('no se puede guardar');
        this.loading.dismiss();
    });
}



  getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
            this.productos = res;

    } );
  }

  async deleteProducto(producto: Producto){
      const alert = await this.alertController.create({
        cssClass: 'normal',
        header: 'advertencia',
        message: '¿estas seguro que quieres eliminar?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'normal',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              // this.alertController.dismiss();
            }
          }, {
            text: 'Ok',
            handler: () => {
              console.log('Confirm Okay');
              this.firestoreService.deleteDoc(this.path, producto.id).then(res => {
                this.presentToast('eliminado con exito');
                this.alertController.dismiss();
            }).catch(error => {
                this.presentToast('no se puede eliminar');
            });
            }
          }
        ]
      });
    
   await alert.present();
  }

  nuevo(){
    this.enableNewProducto = true;
    this.newProducto = {
      nombre: '',
      precioNormal: null,
      precioReducido: null,
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };
  }

  async presentLoanding(){
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando',
    });
    await this.loading.present();
    // await loading.onDidDismiss();
    // console.log()
  }

  async presentToast(msg: string){
    const toast = await this.toastController.create({
      cssClass: 'normal',
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async newImageUpload(event: any){
    if (event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newProducto.foto = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }

  }

}
