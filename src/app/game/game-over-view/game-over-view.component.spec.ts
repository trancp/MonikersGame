import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverViewComponent } from './game-over-view.component';

describe('GameOverViewComponent', () => {
  let component: GameOverViewComponent;
  let fixture: ComponentFixture<GameOverViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameOverViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameOverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
