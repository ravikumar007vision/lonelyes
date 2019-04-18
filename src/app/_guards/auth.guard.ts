import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppAlertService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentUser: any;
  constructor(private router: Router,
    private alert: AppAlertService) {
    }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      this.currentUser = localStorage.getItem('user');
    if (this.currentUser !== null) {
      return true;
    } else {
      this.alert.error('Kindly Login to proceed');
    }
    this.router.navigate(['/login&register'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
