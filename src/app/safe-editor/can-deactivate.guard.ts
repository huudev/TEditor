import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { Observable } from 'rxjs';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<HomeComponent> {
    canDeactivate(component: HomeComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> {
        return component.canDeactivate(nextState.url);
    }
}
