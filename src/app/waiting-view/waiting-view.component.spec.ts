import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingViewComponent } from './waiting-view.component';

describe('WaitingViewComponent', () => {
  let component: WaitingViewComponent;
  let fixture: ComponentFixture<WaitingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
