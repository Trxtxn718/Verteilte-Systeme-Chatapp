import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';

enableProdMode(); // Enable Angular's production mode
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
