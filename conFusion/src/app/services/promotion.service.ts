import { Injectable }                     from '@angular/core';

import { Promotion }                      from '../shared/promotion';
import { baseURL}                         from  '../shared/baseurl';
import { ProcessHTTPMsgService }          from  './process-httpmsg.service';

import { Observable }                     from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';


import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PromotionService {

  constructor(private restangular: Restangular,
              private ProcessHttpMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.restangular.all('promotions').getList();
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.restangular.one('promotions',id).get();
  }

  getFeaturedPromotion(): Observable<Promotion[]> {
    return this.restangular.all('promotions').getList({featured: true});
  }
}