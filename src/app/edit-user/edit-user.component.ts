import {Component, OnInit} from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: User;
  sexs = [
    {name: 'Hombre', value: 'male'},
    {name: 'Mujer', value: 'female'}
  ];
  constructor() {
    this.user = new User();
  }

  ngOnInit() {

  }

  save() {

  }
}
