import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsFormViewComponent } from './words-form-view.component';

describe('RoomViewComponent', () => {
  let component: WordsFormViewComponent;
  let fixture: ComponentFixture<WordsFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsFormViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
