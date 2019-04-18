import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppAlertService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class SellerGuard implements CanActivate {

  currentUser: any;
  constructor(private router: Router,
    private alert: AppAlertService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      this.currentUser = localStorage.getItem('user');
      this.currentUser = JSON.parse(this.currentUser);
    if (this.currentUser.stripe_connect_id != 0) {
      return true;
    } else {
      this.alert.error('please connect with us to receive payments');
    }
    this.router.navigate(['/user-dashboard/user-profile'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
