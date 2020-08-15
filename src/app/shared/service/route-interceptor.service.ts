import { Injectable } from '@angular/core';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})
export class RouteInterceptorService {
    private _previousUrl: string = '';
    private _currentUrl: string = '';
    private _routeHistory: string[];

    constructor(router: Router) {
        this._routeHistory = [];
        router.events
            .pipe(filter(event => event instanceof NavigationStart))
            .subscribe((event: NavigationStart) => {
                this._setURLs(event);
            });
    }

    private _setURLs(event: NavigationStart): void {
        const tempUrl = this._currentUrl;
        this._previousUrl = tempUrl;
        this._currentUrl = event.url;        
        this._routeHistory.push(event.url);
    }

    get previousUrl(): string {
        return this._previousUrl;
    }

    get currentUrl(): string {
        return this._currentUrl;
    }

    get routeHistory(): string[] {
        return this._routeHistory;
    }

}