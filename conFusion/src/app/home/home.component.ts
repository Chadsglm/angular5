import { Component, OnInit, 
         Inject }             from '@angular/core';

import { Dish }               from '../shared/dish';
import { DishService }        from '../services/dish.service';
import { Promotion }          from '../shared/promotion';
import { PromotionService }   from '../services/promotion.service';
import { LeaderService }      from '../services/leader.service';
import { Leader }             from '../shared/leader';
import { flyInOut, expand }   from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})

export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;

  constructor(private dishservice: DishService,
              private promotionservice: PromotionService,
              private leaderService: LeaderService,
              @Inject('BaseURL') private BaseURL)  { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
        .subscribe(dish => this.dish = dish,
        dishErrMess => this.dishErrMess = <any>dishErrMess);
    this.promotionservice.getFeaturedPromotion()
        .subscribe(promotion => this.promotion = promotion[0],
        promotionErrMess => this.promotionErrMess = <any>promotionErrMess);
    this.leaderService.getFeaturedLeader()
        .subscribe(leaders => this.leader = leaders[0],
        leaderErrMess => this.leaderErrMess = <any>leaderErrMess);
  }
}