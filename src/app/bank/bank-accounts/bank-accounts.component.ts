import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankService } from 'src/app/shared/bank.service';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit {
  dataSet: any;
  controlSet: any;
  // bankAccountForms: FormArray = this.fb.array([]);
  bankList = [];
  notification = null;
  data: any = [];
  tableName = "inline";
  constructor(private fb: FormBuilder,
    public bankService: BankService) { }
 
  ngOnInit(): void {
    this.getDetail(); 
  }

  getDetail(){
    this.bankService.getAll().subscribe((list: any) => {
      this.bankService.bankAccountForms.clear();
      let arr= list.map(item => {    
        const data = item.payload.doc.data();
        data.id = item.payload.doc.id; 
        return data;
      })
      arr.forEach((a: any) => {
        this.bankService.bankAccountForms.push(this.fb.group({
             id: [a.id],
             accountNumber: [a.accountNumber, [Validators.required, Validators.min(5)]],
             accountHolder: [a.accountHolder, [Validators.required, Validators.minLength(5)]],
             bankID: [a.bankID, Validators.min(1)],
             IFSC: [a.IFSC, Validators.required]
        }))
      })
      this.dataSet = this.bankService.bankAccountForms.value;
    })
  }

  actionClicked(eventData) {
    switch (eventData.action) {
      case 'Submit':
        this.recordSubmit(eventData.data);
        break;
      case 'Delete':
        this.onDelete(eventData.data.id, eventData.ind);
        break;
      default:
        break;
    }
  }
 

  recordSubmit(data) {
    if (!data.id){
      this.bankService.addCustomer(data);
      // this.showNotification('insert');
    } else {
     this.bankService.update(data);
      // this.showNotification('update');
    }
  }
      

  onDelete(bankAccountID, i) {
    if (bankAccountID == 0) {
      this.bankService.bankAccountForms.removeAt(i);
      // this.showNotification('delete');
    } else if (confirm('Are you sure to delete this record ?')) {
      this.bankService.delete(bankAccountID);
      // this.showNotification('delete');
    }
  }


  displayedColumns: any = [ 
    {
      header_name: "Account Number",
      template_name: "accountNumber",
      type: "default",
      error: [
        { errorType: "required", errorMSG : "Required"},
        { errorType: "min", errorMSG : "Minimum"}
      ]
    },
    {
      header_name: "Account Holder",
      template_name: "accountHolder",
      type: "input",
      error: [
        { errorType: "required", errorMSG : "Required"},
        { errorType: "minlength", errorMSG : "Length Minimum"}
      ]
    },
    {
      header_name: "Bank",
      template_name: "bankID", 
      type: "input",
      error: [
        { errorType: "required", errorMSG : "Required"},
      ]
    },
    {
      header_name: "IFSC",
      template_name: "IFSC",
      type: "input",
      error: [
        { errorType: "required", errorMSG : "Required"},
      ]
    }, 
    {
      header_name: "Actions",
      template_name: "actions",
      type: "default",
      actionsConfig: [ 
        {   buttonName: "Submit", type: "submit" },
        {   buttonName: "Delete", type: "button" },
      ]
    }, 
  ]

  tableConfig = {
    isPagination: true,
    pageSize : 5,
    pageSizeOptions: [5, 10 , 15, 25, 100]
  }

}












// addBankAccountForm() {
//   this.bankService.bankAccountForms.push(this.fb.group({
//     id: [0],
//     accountNumber: ['', Validators.required],
//     accountHolder: ['', Validators.required],
//     bankID: ['', Validators.min(1)],
//     IFSC: ['', Validators.required]
//   }));
// }


// showNotification(category) {
//   switch (category) {
//     case 'insert':
//       this.notification = { class: 'text-success', message: 'saved!' };
//       break;
//     case 'update':
//       this.notification = { class: 'text-primary', message: 'updated!' };
//       break;
//     case 'delete':
//       this.notification = { class: 'text-danger', message: 'deleted!' };
//       break;

//     default:
//       break;
//   }
//   setTimeout(() => {
//     this.notification = null;
//   }, 3000);
// }