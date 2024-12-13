import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseauthService } from '../services/firebaseauth.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: FirebaseauthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.stateAuth().pipe(
      switchMap(user => {
        if (!user) {
          // Si no hay usuario autenticado, redirige al home
          this.router.navigate(['/home']);
          return [false];
        }
        // Obtener UID del usuario autenticado
        return this.authService.getUid().then(uid => {
          const isAdmin = uid === 'VZQyNqTsbxP5GWPQSJBVJjORLlJ3';  // UID del administrador
          if (!isAdmin) {
            this.router.navigate(['/home']);
          }
          return isAdmin;
        });
      })
    );
  }
}
