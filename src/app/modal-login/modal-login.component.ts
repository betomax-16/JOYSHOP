import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {
  email: string;
  pass: string;

  constructor(public dialogRef: MatDialogRef<ModalLoginComponent>,
              public notificacionSnackBar: MatSnackBar,
              private router: Router,
              @Inject( MAT_DIALOG_DATA ) public data: any) { }

  ngOnInit() {
  }

  login() {
    this.notificacionSnackBar.open( 'Login exitoso.', '', {
      duration: 2000,
    } );
    this.dialogRef.close(true);
    this.router.navigate(['/']);
  }
}
