import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NPMDownloadCount } from './services/npm-download-count.service';
import { PackageItemComponent } from './components/package-item/package-item.component';

@NgModule({
  declarations: [
    AppComponent,
    PackageItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    NPMDownloadCount
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
