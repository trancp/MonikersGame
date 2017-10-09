import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamesListComponent } from './players-list.component';

describe('NamesListComponent', () => {
  let component: NamesListComponent;
  let fixture: ComponentFixture<NamesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
