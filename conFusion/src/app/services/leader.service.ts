import { Injectable }                     from '@angular/core';

import { Leader }                         from '../shared/leader';
import { baseURL}                         from  '../shared/baseurl';
import { ProcessHTTPMsgService }          from  './process-httpmsg.service';

import { Observable }                     from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class LeaderService {

  constructor(private restangular: Restangular,
              private ProcessHttpMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.restangular.all('leaders').getList();
  }

  getLeader(id: number): Observable<Leader> {
    return this.restangular.one('leaders',id).get();
  }

  getFeaturedLeader(): Observable<Leader[]> {
    return this.restangular.all('leaders').getList({featured: true});
  }

  getLeaderIds(): Observable<number[]> {
    return this.getLeaders().map(leaders => { 
      return(leaders.map(leader => leader.id) as number[]);
    });         
  }

}
