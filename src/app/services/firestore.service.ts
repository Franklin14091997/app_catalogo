import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

  createDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getId() {
    return this.database.createId();
  }

  getCollection<tipo>(path: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<tipo>(path: string, parametro: string, condicion: any, busqueda: string) {
    const collection = this.database.collection<tipo>(path,
      ref => ref.where(parametro, condicion, busqueda));
    return collection.valueChanges();
  }

  getCollectionAll<T>(
    path: string, 
    parametro: string, 
    condicion: any, 
    busqueda: string,
    startAt: any
  ) {
    if (startAt == null){
      startAt = new Date;
    }
    const collection = this.database.collectionGroup<T>(path, ref =>
      ref.where(parametro, condicion, busqueda)
        .orderBy('fecha', 'desc')
        .limit(2)
        .startAfter(startAt)

    );
    return collection.valueChanges(); // Aquí devolvemos el observable directamente
  }
  
  getCollectionPaginada<T>(
    path: string,
    limit: number, 
    startAt: any
  ) {
    if (startAt == null){
      startAt = new Date;
    }
    const collection = this.database.collection<T>(path, ref =>
      ref
        .orderBy('fecha', 'desc')
        .limit(limit)
        .startAfter(startAt)

    );
    return collection.valueChanges();
}
}