import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class AppserviceService {

  constructor(private afs: AngularFirestore) { }

  getAll() {
    return this.afs.collection('/data').snapshotChanges();
  }

  addEmployee(data) {
    // to create random unique id 
    // data.$key = this.afs.createId();

    data.hireDate = this.dateFormat(data.hireDate);
    return this.afs.collection('/data').add(_.omit(data,'id'));
  }

  update(data){
    data.hireDate = this.dateFormat(data.hireDate);
    return this.afs.collection('/data').doc(data.id).update(_.omit(data,'id'));
  }

  delete(data){
    // console.log(data.id);
    return this.afs.doc('/data/'+data.id).delete();
  }
  
  dateFormat(dateValue) {
    var date = new Date(dateValue), 
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    var dateVal =  [mnth, day, date.getFullYear()].join("/");
    return dateVal;
  }

}
