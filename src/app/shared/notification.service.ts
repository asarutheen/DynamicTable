import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  }

  success(message: string) {
    this.config['panelClass'] = ['notification', 'success'];
    this._snackBar.open(message,'',this.config);
  }

  delete(message: string) {
    this.config['panelClass'] = ['notification', 'warn'];
    this._snackBar.open(message,'',this.config);
  }
}
