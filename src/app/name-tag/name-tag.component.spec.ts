import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameTagComponent } from './name-tag.component';

describe('NameTagComponent', () => {
  let component: NameTagComponent;
  let fixture: ComponentFixture<NameTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
