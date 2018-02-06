import { Component, OnInit, Inject } from '@angular/core';

import { Dish }                      from '../shared/dish';
// import { DISHES }                    from '../shared/dishes';

import { DishService }               from '../services/dish.service';
import { flyInOut, expand }           from '../animations/app.animation';


@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    expand()
  ]
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  errMess: string;
  // selectedDish: Dish;

  constructor(private dishService: DishService,
              @Inject('BaseURL') private BaseURL) {}
  
  ngOnInit() {
    this.dishService.getDishes()
        .subscribe(dishes => this.dishes = dishes,
          errMess => this.errMess = <any>errMess);
  }

}
