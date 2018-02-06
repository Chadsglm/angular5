import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, 
         Validators, FormControl }  from '@angular/forms';

// import {MatSliderModule}            from '@angular/material/slider';

import { Params, ActivatedRoute }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Comment }                  from '../shared/comment';
import { Dish }                     from '../shared/dish';
import { DishService }              from '../services/dish.service'

import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number; 
  commentForm: FormGroup;
  comment: Comment;
  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
    'date': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author name is required.',
      'minlength':     'Authorname must be at least 2 characters long.',
      'maxlength':     'Author name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 3 characters long.',
      'maxlength':     'Comment name cannot be more than 50 characters long.'
    },
    'rating': {
      'required':      'Rating is required.',
    },
  };

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
        .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
        .subscribe(dish => { this.dish = dish; 
                             this.setPrevNext(dish.id); });  
    this.createComment();                                              
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createComment() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: ['' , [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)] ],
      date: new Date(),
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
    this.dish.comments.push(this.comment);
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5,
      date: new Date().toISOString()
    });
  }

}
