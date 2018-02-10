import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinViewComponent } from './join-view.component';

describe('JoinViewComponent', () => {
  let component: JoinViewComponent;
  let fixture: ComponentFixture<JoinViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
