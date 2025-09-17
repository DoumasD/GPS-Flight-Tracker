    import { Injectable, OnDestroy } from '@angular/core';
    import { BehaviorSubject, Observable } from 'rxjs';


    @Injectable({
      providedIn: 'root' 
    })
    export class SharedService {
    
      private _longitudeSource = new BehaviorSubject<number>(0);
      private _latitudeSource = new BehaviorSubject<number>(0);
      private _heightSource = new BehaviorSubject<number>(8000000);
      private _clearSource = new BehaviorSubject<boolean>(false);
      
      
      public currentlong$ = this._longitudeSource.asObservable();
      public currentlat$ = this._latitudeSource.asObservable();
      public currentheight$ = this._heightSource.asObservable();
      public currentClear$ = this._clearSource.asObservable();

      private apiUrl= 'http://localhost:3000/api/ports';
      constructor() { }

      changeZoomArea(long: number, lat:number, height:number) {
        this._longitudeSource.next(long);
        this._latitudeSource.next(lat);
        this._heightSource.next(height);
      }
      
     
      clearEntites(): void {
        this._clearSource.next(true);
      }

      resetClear(): void {
        this._clearSource.next(false);
      }

    }
