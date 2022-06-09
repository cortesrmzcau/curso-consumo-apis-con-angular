import { Component, Input, OnInit, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  //@Input() img: string = '';

  img: string = '';

  @Input('img')
    set changeImg(newImg: string) {
      this.img = newImg;
      console.log('change just img =>', this.img);
      // codes
    }

  @Input() alt: string = '';

  @Output() loaded = new EventEmitter<string>();
  imageDefault = './assets/no-image.png';

  @Output() texto = new EventEmitter<string>();
  txt: string = 'Mensaje enviado desde el hijo';

  // counter = 0;
  // conunterFN: number | undefined;

  constructor() {
    // before render
    // NO async -- once time
  }

  ngOnChanges(): void {
      // before - during render
      // changes inputs --multiples times
      console.log('ngOnChanges', 'imageValue =>', this.img);
      // if(changes) {
      //   code
      // }
  }

  ngOnInit(): void {
    // before render
    // async - fetch -- once time
    //this.texto.emit(this.txt);
    console.log('ngOnInit', 'imgValue =>', this.img);
    // this.conunterFN = window.setInterval(() => {
    //   this.counter += 1;
    //   console.log('run counter');
    // }, 1000)
  }

  ngAfterViewInit(): void {
    // after render
    // handler children - fetch -- once time
    console.log('ngAfterViewInit');
  }

  ngOnDestroy(): void {
      // delete component -- once time
      console.log('ngOnDestroy');
      // window.clearInterval(this.conunterFN);
  }

  imgError() {
    this.img = this.imageDefault;
  }

  imgLoaded() {
    console.log('log hijo');
    this.loaded.emit(this.img);
  }

}
