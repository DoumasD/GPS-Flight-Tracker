import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

(window as any).CESIUM_BASE_URL = './src/assets/';
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
