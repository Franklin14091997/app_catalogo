import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GooglemapsComponent } from 'src/app/googlemaps/googlemaps.component';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  cliente: Cliente = {
    uid: '',
    email: '',
    celular: '',
    foto: '',
    referencia: '',
    nombre: '',
    ubicacion: null,
  };

  newFile: any;
  uid = '';
  suscriberUserInfo: Subscription = new Subscription();
  ingresarEnable = false;

  constructor(
    public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public firestorageService: FirestorageService,
    private modalController: ModalController
  ) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      } else {
        this.initCliente();
      }
    });
  }

  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    console.log(uid);
  }

  initCliente() {
    this.uid = '';
    this.cliente = {
      uid: '',
      email: '',
      celular: '',
      foto: '',
      referencia: '',
      nombre: '',
      ubicacion: null,
    };
    console.log(this.cliente);
  }

  openMenu() {
    console.log('open menu');
    this.menucontroller.toggle('principal');
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        this.cliente.foto = image.target?.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async registrarse() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular,
    };

    try {
      const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password);
      if (res) {
        const uid = await this.firebaseauthService.getUid();
        this.cliente.uid = uid ? uid : '';
        this.guardarUser();
      } else {
        console.log("No se pudo registrar el usuario.");
      }
    } catch (error) {
      console.log('Error en el registro:', error);
    }
  }

  async guardarUser() {
    const path = '/Clientes/';
    const name = this.cliente.nombre;

    try {
      if (this.newFile) {
        const res = await this.firestorageService.uploadImage(this.newFile, path, name);
        this.cliente.foto = res;
      }

      await this.firestoreService.createDoc(this.cliente, path, this.cliente.uid);
      console.log('Usuario guardado con éxito');
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  }

  async salir() {
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
  }

  getUserInfo(uid: string) {
    console.log('Obteniendo información del usuario');
    const path = '/Clientes/';
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res => {
      if (res) {
        this.cliente = res;
      }
    });
  }

  ingresar() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular,
    };

    this.firebaseauthService.login(credenciales.email, credenciales.password)
      .then(res => {
        console.log('Ingreso con éxito');
      })
      .catch(error => {
        console.log('Error en el ingreso:', error);
      });
  }

  async addDirection() {
    const ubicacion = this.cliente.ubicacion;
    let position = {
      lat: -2.898116,
      lng: -78.99958149999999
    };
  
    if (ubicacion !== null) {
      position = ubicacion;
    }
  
    const modalAdd = await this.modalController.create({
      component: GooglemapsComponent,
      mode: 'ios',
      componentProps: { position }
    });
  
    await modalAdd.present();
  
    const { data } = await modalAdd.onDidDismiss();  // Uso de onDidDismiss() en lugar de onWillDismiss()
  
    if (data) {
      console.log('data -> ', data);
      this.cliente.ubicacion = data.pos;
      console.log(this.cliente);  // Corregir la sintaxis del console.log
    }
  }
  

}
