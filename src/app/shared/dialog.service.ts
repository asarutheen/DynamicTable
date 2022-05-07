import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponentComponent } from '../dialog/confirm-dialog-component/confirm-dialog-component.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg){
    return this.dialog.open(ConfirmDialogComponentComponent, {
      width: "390px",
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg
      }
    })
  }
}
