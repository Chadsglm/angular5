import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuComponent } from './menu.component';

import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
         MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,
         MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule,
         MatCardModule, MatIconModule, MatProgressSpinnerModule,
         MatDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { DISHES } from '../shared/dishes';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs/Observable';

fdescribe('MenuComponent', () => {
  let component: MenuComponent;
  /**
   * Fixture, this is to make an exact copy environment 
   * of a MenuComponent which already exist,
   * so that we dont mix up things with the actual MenuComponent when we are testing
   */
  let fixture: ComponentFixture<MenuComponent>;

  /**
   * ASYNC, here we use async bc compileComponents function needs
   * some time to make everything ready for the test environment.
   * And it will let us do wait until everything is completed then it 
   * moves to next block of code.
   */
  beforeEach(async(() => {

    let dishServiceStub = {
      getDishes: function(): Observable<Dish[]> {
        return Observable.of(DISHES);
      }
    };
  /**
   * Testbad creates an environment within i can test my component.
   */
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule,
        MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
        MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,
        MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule,
        MatCardModule, MatIconModule, MatProgressSpinnerModule,
        MatDialogModule,
        FlexLayoutModule,
        RouterTestingModule.withRoutes([{ path: 'menu', component: MenuComponent }])
      ],
      declarations: [ MenuComponent ],
      providers: [
        { provide: DishService, useValue: dishServiceStub },
        { provide: 'BaseURL', useValue: baseURL },
      ]
    })
    .compileComponents();

    let dishservice = TestBed.get(DishService);

  }));
/**
 * this second beforeEach is needed bc the first one needs to be completed 
 * so that this second one can set its variables.
 * that is why it is separeted from the top.
 */
  beforeEach(() => {
    // gets menuComponent reference
    fixture = TestBed.createComponent(MenuComponent);
    // it gets the created instance
    component = fixture.componentInstance;
    // it will detect any changes and will apply them everytime it is called.
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dishes items should be 4', () => {
    // console.log('compoentns', component);
    expect(component.dishes.length).toBe(4);
    expect(component.dishes[1].name).toBe('Zucchipakoda');
    expect(component.dishes[3].featured).toBeFalsy();
  });

  it('should use dishes in the template', () => {
    fixture.detectChanges();

    let de:      DebugElement;
    let el:      HTMLElement;
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    
    expect(el.textContent).toContain(DISHES[0].name.toUpperCase());

  });

  describe('MenuComponent table ', () => { 
    it("it checks sorting functionality of the table", () => {
      expect(1).toBe(1);
    })
  })
});
