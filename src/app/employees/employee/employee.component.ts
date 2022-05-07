import { Component, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppserviceService } from 'src/app/shared/appservice.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @ViewChild('callDialog') callAPIDialog: TemplateRef<any>;

  dataSet: any;
  dialogRef: any;
  tableName= "dataTable"

  constructor(private appService: AppserviceService,
    private matDialog: MatDialog, private dialogService: DialogService,
     private notiService: NotificationService) { }

  ngOnInit(): void {
    this.appService.getAll().subscribe((list: any) => {
      this.dataSet = list.map(item => {
        const data = item.payload.doc.data();
        data.id = item.payload.doc.id; 
        return data;
      })
    })
  }

  setDialogRef(data){
    this.dialogRef = data; 
  }

  onClose(){
    this.dialogRef.close();
  }

  actionClickedEmployee(eventData){
    switch (eventData.action) {
      case 'launch':
        this.onUpdate(eventData.data);
        break;
      case 'delete_outline':
        this.delete(eventData.data);
        break;
      default:
        break;
    }
  }

  populateFormData(data) {
    this.form.setValue(data);
    this.form.patchValue({ hireDate: new Date (this.appService.dateFormat(data.hireDate) )});
  }

  onSubmit() {
    if(this.form.valid){
      if(!this.form.get('id').value){
        this.appService.addEmployee(this.form.value)
        this.notiService.success("Success");
      } else {
        this.appService.update(this.form.value)
        this.notiService.success("Update");
      }
      this.onClear();
      this.dialogRef.close();
    }
  }

  onUpdate(data) {
    // this.emp.populate(data);
    this.populateFormData(data);
    const config = new MatDialogConfig();
    // disable close dialog box when click on outside the dialog box
    config.disableClose = true;
    // focus first element in dialog box
    config.autoFocus = true;
    config.width = "60%";
    this.dialogRef = this.matDialog.open(this.callAPIDialog, config);
  }

  delete(data) {
    this.dialogService.openConfirmDialog("Are you sure to delete this record?")
    .afterClosed().subscribe(res => {
      if(res){
        this.appService.delete(data);
        this.notiService.delete("! Delete Successfully")
      }
    })
  }

  onClear(){}

  departments = [
    { id: 1, value: 'Dep 1'},
    { id: 2, value: 'Dep 2'},
    { id: 3, value: 'Dep 3'},
  ]

  displayedColumns: any = [ 
    {
      header_name: "Full Name",
      template_name: "fullName",
      type: "default",
    },
    {
      header_name: "Email",
      template_name: "email",
      type: "default",
    },
    {
      header_name: "Mobile",
      template_name: "mobile",
      type: "default",
    },
    {
      header_name: "City",
      template_name: "city",
      type: "default",
    }, 
  
    {
      header_name: "Date",
      template_name: "hireDate",
      type: "default",
    },
    {
      header_name: "Action",
      template_name: "action",
      type: "default",
      actionsConfig: [ 
        {   iconName: "launch", color: "" },
        {   iconName: "delete_outline", color: "warn" },
      ]
    },
  ]

  tableConfig = {
    isPagination: true,
    pageSize : 5,
    pageSizeOptions: [5, 10 , 15, 25, 100]
  }
   
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('',  Validators.email),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
    city: new FormControl(''),
    gender: new FormControl("1"), 
    department: new FormControl("1"),
    hireDate: new FormControl(new Date()),
    isPermanent: new FormControl(true),
  })
  
  initializeFormGroup() {
    this.form.setValue({
      id: null,
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      gender: "1",
      department: "1",
      hireDate: new Date(),
      isPermanent: true,
    })
  }
}
