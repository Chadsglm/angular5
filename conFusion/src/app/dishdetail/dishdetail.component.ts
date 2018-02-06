import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, 
         Validators, FormControl }  from '@angular/forms';

import { MatSliderModule }          from '@angular/material/slider';

import { Params, ActivatedRoute }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Comment }                  from '../shared/comment';
import { Dish }                     from '../shared/dish';
import { DishService }              from '../services/dish.service'
import { visibility, flyInOut, 
         expand }                   from '../animations/app.animation';

import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishcopy? : Dish =  null;
  dishIds: number[];
  prev: number;
  next: number; 
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'rating': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author name is required.',
      'minlength':     'Authorname must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 5 characters long.',
    },
    'rating': {
      'required':      'Rating is required.',
    },
  };

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.createComment();  

    this.dishservice.getDishIds().subscribe(dishIds => {
      this.dishIds = dishIds;
    });
    this.route.params
        .switchMap((params: Params) => { 
          this.visibility = 'hidden'; 
          return this.dishservice.getDish(+params['id']);
        })
        .subscribe(
          dish => { 
            this.dish = dish; 
            this.dishcopy = dish; 
            this.setPrevNext(dish.id); 
            this.visibility = 'shown'; 
          },
          errmess => { 
            this.dish = null;
            this.errMess = <any>errmess; 
          }
        );
  }

  setPrevNext(dishId: number) {
    if(!this.dishIds) return;
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createComment(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: [5 , [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)] ],
      date: new Date()
    });

    this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) { 
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field); 
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    } 
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    console.log('dishdetail rest', this.dishcopy);
    this.dishcopy['save']()
        .subscribe(dish => {
          this.dish = dish;
          });
    
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
  }

}
