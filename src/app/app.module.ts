import {NgModule, Component, Injectable} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {JsonpModule, Jsonp, Response} from '@angular/http';
import {ReactiveFormsModule, FormControl, FormsModule} from '@angular/forms';
import {Routes, RouterModule} from "@angular/router";
import {Observable} from 'rxjs';
import 'rxjs/add/operator/toPromise';

import { SearchService } from './app.component';

import { 
  AppComponent, 
  HomeComponent, 
  SearchComponent, 
  HeaderComponent,
  ArtistComponent,
  ArtistTrackListComponent,
  ArtistAlbumListComponent
} from './app.component';
import { from } from 'rxjs/observable/from';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'find', redirectTo: 'search'},
  {path: 'home', component: HomeComponent},
  {path: 'search', component: SearchComponent },
  {path: 'artist/:artistId', component: ArtistComponent,
      children: [
        {path:'', redirectTo: 'tracks', pathMatch: 'full'},
        {path: 'tracks', component: ArtistTrackListComponent},
        {path: 'albums', component: ArtistAlbumListComponent}
      ]
  },
  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HomeComponent,
    HeaderComponent,
    ArtistComponent,
    ArtistTrackListComponent,
    ArtistAlbumListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    JsonpModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
