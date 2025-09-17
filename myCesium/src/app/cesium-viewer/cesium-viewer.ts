import { Component, OnInit, AfterViewInit,  NgZone, OnDestroy} from '@angular/core';
import * as Cesium from 'cesium';
import { SharedService } from '../services/shared.service';
import { SerialPortsService } from '../services/serialport.service';
import {  Subscription, forkJoin ,combineLatest, Observable} from 'rxjs';

@Component({
  selector: 'app-cesium-viewer',
  imports: [],
  templateUrl: './cesium-viewer.html',
  styleUrl: './cesium-viewer.css'
})
export class CesiumViewer implements OnInit, AfterViewInit{
  private long: number=0;
  private lat: number= 0;
  private height: number =0;
  private subscriptions: Subscription[] =[];
  private obs1long$:Observable<number>=new Observable<number>;
  private obs2lat$:Observable<number>=new Observable<number>;
  private obs3height$:Observable<number>=new Observable<number>;
  private test: Subscription = new Subscription;
  private testTwo: Subscription = new Subscription;
  private testthree: Subscription = new Subscription;
 
  constructor(private ngZone: NgZone, private sharedService: SharedService, private serialPortsService:SerialPortsService) {
       this.obs1long$ = this.sharedService.currentlong$;
       this.obs2lat$ = this.sharedService.currentlat$;
       this.obs3height$ = this.sharedService.currentheight$;
  }
  
  ngOnInit(): void {

    this.subscriptions.push(this.sharedService.currentlong$.subscribe(long => {this.long=long;}),
                           this.sharedService.currentlat$.subscribe(lat=> {this.lat=lat;}),
                          this.sharedService.currentheight$.subscribe(height => {this.height=height;})
                           );    
  }

  ngAfterViewInit(): void {
    
    const viewer = new Cesium.Viewer(
                            "cesiumContainer",
                            {
                              terrain: Cesium.Terrain.fromWorldTerrain(),
                              targetFrameRate: 240.0,
                              useBrowserRecommendedResolution : false,
                              timeline: false,
                              animation: false,
                              navigationHelpButton: false,
                              selectionIndicator: false,
                              homeButton: false,
                              geocoder: false,
                              baseLayerPicker: false
                              
                              
                            }
                    );
  viewer.cesiumWidget.creditContainer.parentNode?.removeChild(viewer.cesiumWidget.creditContainer);

  
  viewer.camera.flyTo(
          {
            destination: Cesium.Cartesian3.fromDegrees(this.long,this.lat,this.height), // Longitude, Latitude, Height in meters
          }
  );

  this.test =combineLatest([this.obs1long$, this.obs2lat$, this.obs3height$]).subscribe(
    ([data1, data2, data3]) => {
    
      this.changeSceneArea(data1, data2, data3, viewer);
    
    },
    
    error => {
      console.error('Error combining observables:', error);
    }
  
  );
  


  this.testTwo = this.serialPortsService._messages.subscribe((x)=>{
           
      let obj=JSON.parse(x);
      let array= obj.data.split(" ");

            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(parseFloat(array[3]),parseFloat(array[1]), parseFloat(array[5].slice(0, -1))),
              point: {
                pixelSize: 10,
                color: Cesium.Color.RED
              }});
     });

  this.testthree = this.sharedService.currentClear$.subscribe((x)=>{

    if(x == true)
      {
        viewer.entities.removeAll(); 
        this.sharedService.resetClear();
      }

  });

}

changeSceneArea(long:number, lat: number,height:number, viewer:Cesium.Viewer): void {

      viewer.camera.flyTo(
          {
            destination: Cesium.Cartesian3.fromDegrees(long,lat,height), // Longitude, Latitude, Height in meters
          }
      );

}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.test.unsubscribe();
    this.testTwo.unsubscribe();
    this.testthree.unsubscribe();
  }
}
