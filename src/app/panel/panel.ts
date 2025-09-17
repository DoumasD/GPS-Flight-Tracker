import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule,FormGroup} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { SerialPortsService } from '../services/serialport.service';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-panel',
  imports: [MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],

  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel implements OnInit{
  
 
  public selectedPort: string =' ';
  public selectedBaudrate: string =' ';
  public serialPorts: string[]=[];
  public buttonText: string = "Start";
  public baudrates: String[] = ["9600", "19200", "38400", "57600", "115200", "128000", "256000"];
  public Longitude: number =0;
  public Latitude: number =0;
  public Height: number =0;
  public zoomForm: FormGroup = new FormGroup({});
  public serialcomForm: FormGroup= new FormGroup({});


  constructor(private sharedService: SharedService, private serialPortsService:SerialPortsService) {}


  ngOnInit(): void {

    this.serialPortsService.connect('http://localhost:8080');     
       
    this.serialPortsService._messages.subscribe((x)=>{               
      
      x = JSON.parse(x);

      if (x['type']==='serialPorts')
      {
        this.serialPorts=x['data'];
      }
       });
  }


flytoArea():void {
  const long = this.Longitude;
  const lat = this.Latitude;
  const height = this.Height;
  this.sharedService.changeZoomArea(long,lat,height);
}


openCloseSerialConnection(): void{
  if(this.buttonText== "Start"){
     
    this.serialPortsService.sendMessage(JSON.stringify({type:'openSerialPort',port:this.selectedPort, baudRate:this.selectedBaudrate}));
    this.buttonText="Stop";
  }
  else
  {
    this.serialPortsService.disconnect();
    this.serialPortsService.connect('http://localhost:8080');  
    this.buttonText="Start";
  }
}

clear():void {
  this.sharedService.clearEntites();
}
 
}
