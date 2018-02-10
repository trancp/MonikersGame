import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameDropZoneComponent } from './name-drop-zone.component';

describe('NameDropZoneComponent', () => {
  let component: NameDropZoneComponent;
  let fixture: ComponentFixture<NameDropZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameDropZoneComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameDropZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
