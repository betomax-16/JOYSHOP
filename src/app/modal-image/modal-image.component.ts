import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent implements OnInit {

  listFilesFirebase: string[];
  imageSelected: string;
  index = 0;

  constructor(public dialogRef: MatDialogRef<ModalImageComponent>,
              @Inject( MAT_DIALOG_DATA ) public data: any) {
      this.listFilesFirebase = [];
      this.imageSelected = '';
  }

  ngOnInit() {
  }

  before() {
    const limit = this.listFilesFirebase.length - 1;
    this.index = this.index <= 0 ? limit : this.index - 1;
    this.imageSelected = this.listFilesFirebase[this.index];
  }

  next() {
    const limit = this.listFilesFirebase.length - 1;
    this.index = this.index >= limit ? 0 : this.index + 1;
    this.imageSelected = this.listFilesFirebase[this.index];
  }

  onlyImage() {
      return this.listFilesFirebase.length === 0 || this.listFilesFirebase.length === 1;
  }
}
