import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeLineTextComponent } from './three-line-text.component';

describe('ThreeLineTextComponent', () => {
  let component: ThreeLineTextComponent;
  let fixture: ComponentFixture<ThreeLineTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeLineTextComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeLineTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
