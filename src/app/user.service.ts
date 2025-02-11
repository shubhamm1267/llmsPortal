import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "https://backend-llmsportal.onrender.com";

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.apiUrl + "/users");
  }

  addUser(user: any) {
    return this.http.post(this.apiUrl + "/users", user);
  }

  updateUser(id: string, user: any) {
    return this.http.put(`${this.apiUrl+ "/users"}/${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl+ "/users"}/${id}`);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  getUserDetails(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/user/${username}`);
  }

  getUserCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/userCounts`);
  }
}
