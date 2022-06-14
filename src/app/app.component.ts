import { Component } from '@angular/core';

import { Product } from './models/product.model';
import { UsersService } from './services/users.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  imgParent = ''; // https://www.w3schools.com/howto/img_avatar.png
  showImg = true;

  constructor(
    private usersService: UsersService
  ) {

  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  loadMensaje(txt: string) {
    console.log(txt);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create({
      name: 'Cesar',
      email: 'cesar@mail.com',
      password: '1212'
    })
    .subscribe(rta => {
      console.log(rta);
    });
  }
}
