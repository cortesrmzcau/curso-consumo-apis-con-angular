import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`;

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password});
  }

  profile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  getProfile(token: any) {
    // const headers = new HttpHeaders();
    // headers.set('Authorization',  `Bearer ${token}`);
    // return this.http.get<User>(`${this.apiUrl}/profile`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     // 'Content-type': 'application/json'
    //   }
    // });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    headers = headers.set('Content-type', 'application/json');
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers });
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap(rta => this.getProfile(rta.access_token)),
    )
  }
}
