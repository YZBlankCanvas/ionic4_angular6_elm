import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, DataService, LocalStorageService } from '../service';

@Component({
  selector: 'page-city',
  templateUrl: 'city.page.html',
  styleUrls: ['city.page.scss']
})
export class CityPage implements OnInit {
  guessCity: string;
  guessCityId: string;
  placeList: any[];
  placeNone: boolean;
  placeHistory: any[];
  historyTitle: boolean;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public appService: AppService,
    public dataService: DataService,
    public storageService: LocalStorageService) {
    this.guessCityId = this.route.snapshot.paramMap.get('id');
    this.guessCity = '';
    this.placeList = [];
    this.placeHistory = [];
    this.historyTitle = true;
    this.getCityById(this.guessCityId);
  }

  ngOnInit() {
    this.getPlaceHistory();
  }

  getPlaceHistory() {
    if (this.storageService.getStore('placeHistory')) {
      this.placeList = JSON.parse(this.storageService.getStore('placeHistory'));
    } else {
      this.placeList = [];
    }
  }

  getCityById(id: string) {
    this.dataService.getCityById(id).subscribe(res => {
      this.guessCity = res.name;
    });
  }

  setSearchStorage(place: any) {
    let history = this.storageService.getStore('placeHistory');
    let choosePlace = place;
    if (history) {
      let checkrepeat = false;
      this.placeHistory = JSON.parse(history);
      this.placeHistory.forEach(item => {
        if (item.geohash === place.geohash) {
          checkrepeat = true;
        }
      });
      if (!checkrepeat) {
        this.placeHistory.push(choosePlace);
      }
    } else {
      this.placeHistory.push(choosePlace);
    }
    this.storageService.setStore('placeHistory', this.placeHistory);
  }

  searchPlace(text: string) {
    if (!text) {
      return;
    }
    this.historyTitle = false;
    this.dataService.searchPlace(this.guessCityId, text).subscribe(res => {
      this.placeList = res;
      this.placeNone = res.length ? false : true;
    });
  }

  cancelSearch() {
    this.getPlaceHistory();
  }

  clearAll() {
    this.storageService.removeStore('placeHistory');
    this.placeList = [];
  }

  toMiste(place: any) {
    this.setSearchStorage(place);
    this.appService.geohash = place.geohash;
    this.router.navigate(['/app/tab/msite'], {queryParams: {geohash: place.geohash}});
  }
}
