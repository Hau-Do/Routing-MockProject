import {NgModule, Component, Injectable} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {JsonpModule, Jsonp, Response} from '@angular/http';
import {ReactiveFormsModule, FormControl, FormsModule} from '@angular/forms';
import {Routes, Router, RouterModule, ActivatedRoute} from "@angular/router";
import {Observable} from 'rxjs';
import 'rxjs/add/operator/toPromise';

class SearchItem {
  constructor(public name: string,
              public artist: string,
              public link: string,
              public thumbnail: string,
              public artistId: string) {
  }
}

@Injectable()
export class SearchService {
  apiRoot: string = 'https://itunes.apple.com/search';
  results: SearchItem[];

  constructor(private jsonp: Jsonp) {
    this.results = [];
  }

  search(term: string) {
    return new Promise((resolve, reject) => {
      this.results = [];
      let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20&callback=JSONP_CALLBACK`;
      this.jsonp.request(apiURL)
          .toPromise()
          .then(
              res => { // Success
                this.results = res.json().results.map(item => {
                  return new SearchItem(
                      item.trackName,
                      item.artistName,
                      item.trackViewUrl,
                      item.artworkUrl30,
                      item.artistId
                  );
                });
                resolve();
              },
              msg => { // Error
                reject(msg);
              }
          );
    });
  }
}


@Component({
  selector: 'app-search',
  template: `<form class="form-inline">
  <div class="form-group">
    <input type="search"
           class="form-control"
           placeholder="Enter search string"
           #search>
  </div>
  <button type="button"
          class="btn btn-primary"
          (click)="onSearch(search.value)">
    Search
  </button>
</form>

<hr />

<div class="text-center">
  <p class="lead"
     *ngIf="loading">Loading...</p>
</div>

<div class="list-group">
  <a [routerLink]="['/artist', track.artistId]"
     class="list-group-item list-group-item-action"
     *ngFor="let track of itunes.results">
    <img src="{{track.thumbnail}}">
    {{ track.name }} <span class="text-muted">by</span> {{ track.artist }}
  </a>
</div>
 `
})
export class SearchComponent {
  private loading: boolean = false;

  constructor(
    private itunes: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      if(params['term']) {
        this.doSearch(params['term']);
      }
      
    });
  }

  doSearch(term: string) {
    this.loading = true;
    this.itunes.search(term).then(_ => this.loading = false)
  }

  onSearch(term: string) {
    this.router.navigate(['search', {term: term}]);
  }
  
}

@Component({
  selector: 'app-home',
  template: `
<div class="jumbotron">
  <h1 class="display-3">iTunes HOME</h1>
</div>
 `
})
export class HomeComponent {
}

@Component({
  selector: 'app-header',
  template: `
<nav class="navbar navbar-light bg-faded">
  <a class="navbar-brand" [routerLink]="['home']">iTunes Search App</a>
  <ul class="nav navbar-nav">
    <li class="nav-item" [routerLinkActive]="['active']">
      <a class="nav-link" [routerLink]="['home']" [routerLinkActive]="['active']">Home</a>
    </li>
    <li class="nav-item" [routerLinkActive]="['active']">
      <a class="nav-link" [routerLink]="['search']">Search</a>
    </li>
  </ul>
</nav>
 `
})
export class HeaderComponent {
  constructor (private router: Router) {}

  // goHome() {
  //   this.router.navigate(['']);
  // }

  // goSearch() {
  //   this.router.navigate(['search']);
  // }
}

@Component({
  selector: 'app-artist',
  template: `
<h1>Artist</h1>
<p>
  <a [routerLink]="['./tracks']">Tracks</a> |
  <a [routerLink]="['./albums']">Albums</a>
</p>

<router-outlet></router-outlet>
 `
})
export class ArtistComponent {
}

@Component({
  selector: 'app-artist-track-list',
  template: `
<h1>Artist Track Listing</h1>
 `
})
export class ArtistTrackListComponent {
  constructor(private route: ActivatedRoute) {
    this.route.parent.params.subscribe(params => console.log(params));
  }
}

@Component({
  selector: 'app-artist-album-list',
  template: `
<h1>Artist Album Listing</h1>
 `
})
export class ArtistAlbumListComponent {
}

/**
 * APP- ROOT
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
}
