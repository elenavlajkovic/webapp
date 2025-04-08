import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken.uloga === 'profesor') {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
