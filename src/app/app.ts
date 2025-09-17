import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CesiumViewer} from './cesium-viewer/cesium-viewer';
import {Panel} from './panel/panel';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CesiumViewer, Panel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
