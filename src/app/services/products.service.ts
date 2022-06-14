import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';

import { environment } from 'src/environments/environment';
import { checkTime } from '../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAllProdructs(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && params) {
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }

    return this.http.get<Product[]>(this.apiUrl, { params, context: checkTime() })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(
      this.getProduct(id),
      this.update(id, dto)
    )
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict) {
            return throwError(() => new Error('Algo esta fallando en el server'));
          }

          if (error.status === HttpStatusCode.NotFound) {
            return throwError(() => new Error('El producto no existe'));
          }

          if (error.status === HttpStatusCode.Unauthorized) {
            return throwError(() => new Error ('No esta permitido'));
          }

          return throwError(() => new Error ('Ups algo salio mal'));
        })
      );
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: { limit, offset }
    });
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
