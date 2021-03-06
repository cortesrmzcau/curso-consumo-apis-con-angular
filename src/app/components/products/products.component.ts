import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { CreateProductDTO, Product, UpdateProductDTO } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: ''
  };

  limit = 10;
  offset = 0;

  statusDetail: 'loading' | 'sucess' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productService.getAllProdructs(10, 0)
    .subscribe(data => {
      this.products = data;
      this.offset += this.limit;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.toggleProductDetail();
    this.statusDetail = 'loading';
    setTimeout(() => {
      this.productService.getProduct(id)
        .subscribe({
          next: (data) => {
            this.productChosen = data;
            this.statusDetail = 'sucess'
          },
          error: (errorMsg => {
            Swal.fire({
              icon: 'error',
              text: errorMsg
            })
            this.statusDetail = 'error';
          })
        })
    }, 800);
  }

  readAndUpdate(id: string) {
    this.productService.getProduct(id)
      .pipe(
        switchMap((product) => this.productService.update(product.id, { title: 'change' }))
      )
      .subscribe(data => {
        console.log(data);
      });

    this.productService.fetchReadAndUpdate(id, { title: 'nuevo' })
      .subscribe(response => {
        const read = response[0];
        const update = response[1];
      })
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo producto',
      description: 'bla bla bla',
      images: [`https://placeimg.com/640/480/any?random=${Math.random()}`],
      price: 1000,
      categoryId: 2
    }

    this.productService.create(product)
      .subscribe(data => {
        this.products.unshift(data);
      })
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'change title',
    }

    const id = this.productChosen.id;
    this.productService.update(id, changes)
      .subscribe(data => {
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products[productIndex] = data;
        this.productChosen = data;
      })
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productService.delete(id)
      .subscribe(() => {
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });
  }

  loadMore() {
    this.productService.getProductsByPage(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      })
  }
}
