import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToolService {
    filterObject(obj) {
        const ret = {};
        Object.keys(obj)
            .filter((key) => obj[key] !== undefined)
            .forEach((key) => ret[key] = obj[key]);
        return ret;
    }
}