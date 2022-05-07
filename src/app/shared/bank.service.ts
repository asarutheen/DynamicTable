import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  bankAccountForms: FormArray = this.fb.array([]);


  constructor(private afs : AngularFirestore, private fb: FormBuilder) { }

  addBankAccountForm() {
    this.bankAccountForms.push(this.fb.group({
      id: [0],
      accountNumber: ['', [Validators.required, Validators.min(5)]],
      accountHolder: ['', [Validators.required, Validators.minLength(5)]],
      bankID: ['', Validators.required],
      IFSC: ['', Validators.required]
    }));
  }
  
  addCustomer(data) {
    // to create random unique id 
    // data.$key = this.afs.createId();

    // data.hireDate = this.dateFormat(data.hireDate);
    return this.afs.collection('/bank').add(_.omit(data,'id'));
  }
  getAll() {
    return this.afs.collection('/bank').snapshotChanges();
  }
  delete(data){
    console.log(data.id);
    return this.afs.doc('/bank/'+data.id).delete();
  }
  update(data){
    // data.hireDate = this.dateFormat(data.hireDate);
    return this.afs.collection('/bank').doc(data.id).update(_.omit(data,'id'));
  }
}
