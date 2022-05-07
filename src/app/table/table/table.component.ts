import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppserviceService } from 'src/app/shared/appservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EmployeeComponent } from 'src/app/employees/employee/employee.component';
import { DialogService } from 'src/app/shared/dialog.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { BankService } from 'src/app/shared/bank.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class TableComponent implements OnInit {

  constructor(private appService: AppserviceService,
    private matDialog: MatDialog, private dialogService: DialogService,
    private notiService: NotificationService,
    public bankService: BankService) { }
    
  searchKey: string;
  
  dataList : MatTableDataSource<any>;
  displayedColumns: string[]=[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() data: any; 
  @Input() columnName; 
  @Input() dia;
  @Input() tableConfig;
  @Input() tableName;
  @Output() referencePassEvent = new EventEmitter();
  @Output() initializeForm = new EventEmitter();
  @Output() actionClicked = new EventEmitter();
  @Output() actionClickedEmployee = new EventEmitter();

  ngOnInit(): void {
      this.columnName.forEach(element => {
        this.displayedColumns.push(element.header_name)  
      });
  }
  ngAfterViewInit() {
    this.dataList.sort = this.sort;
    this.tableConfig.isPagination ? this.dataList.paginator = this.paginator : null;
  }
  ngOnChanges() {
    this.dataList = new MatTableDataSource(this.data);
    this.dataList.sort = this.sort;
    this.tableConfig.isPagination ? this.dataList.paginator = this.paginator : null;
  }

  onSearchClear(){
    this.searchKey = '';
    this.dataList.filter = this.searchKey.trim().toLowerCase()
  }

  applyFilter(){
    this.dataList.filter = this.searchKey.trim().toLowerCase();
  }

  //For Employee Component 

  actionClickEmployee(iconName, data, i){
    this.actionClickedEmployee.emit(Object.assign({action: iconName},{data: data}, {ind : i} ));
  }

  onCreate() {
    // add EmployeeCoponent in app.module.ts under entryComponent
    this.initializeForm.emit();
    const config = new MatDialogConfig();
    // disable close dialog box when click on outside the dialog box
    config.disableClose = true;
    // focus first element in dialog box
    config.autoFocus = true;
    config.width = "60%";
    const dialogRef = this.matDialog.open(this.dia, config);
    this.refPass(dialogRef);
  }

  refPass(ref) {
    this.referencePassEvent.emit(ref);
  }

  // For Bank Component

  actionClick(buttonName, data, i){
    this.actionClicked.emit(Object.assign({action: buttonName},{data: data.value}, {ind :i}));
  }

  onCreateFormArray() {
    this.bankService.addBankAccountForm();
  }
}
