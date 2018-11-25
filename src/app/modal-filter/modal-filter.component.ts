import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Search } from '../models/search';

@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.css']
})
export class ModalFilterComponent implements OnInit {

  min: number;
  max: number;
  objectSearch: Search;

  constructor(public dialogRef: MatDialogRef<ModalFilterComponent>,
              private route: ActivatedRoute,
              private router: Router,
              @Inject( MAT_DIALOG_DATA ) public data: any) {
        this.objectSearch = new Search();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
        params => {
            // tslint:disable-next-line:forin
            for (const key in params) {
                this.objectSearch[key] = params[key];
            }
            this.max = this.objectSearch['price<'];
            this.min = this.objectSearch['price>'];
        }
    );
  }

  sendFilter() {
    this.objectSearch['price<'] = this.max;
    this.objectSearch['price>'] = this.min;
    this.router.navigate(['search'], { queryParams: this.objectSearch });
  }

  clear() {
    // tslint:disable-next-line:forin
    for (const key in this.objectSearch) {
      if (key !== 'q') {
        delete this.objectSearch[key];
      }
    }
    this.router.navigate(['search'], { queryParams: this.objectSearch });
  }
}
