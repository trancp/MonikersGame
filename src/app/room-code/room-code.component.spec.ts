import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCodeComponent } from './room-code.component';

describe('RoomCodeComponent', () => {
  let component: RoomCodeComponent;
  let fixture: ComponentFixture<RoomCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
