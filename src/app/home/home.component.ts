import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalLoginComponent } from '../modal-login/modal-login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public message: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.message = 'Hello';
  }

  showLogin() {
    const dialogRef = this.dialog.open( ModalLoginComponent,
      {
          panelClass: 'modalLogin'
      } );

    dialogRef.afterClosed()
      .subscribe( result => {
          console.log(result);
      });
  }
}
