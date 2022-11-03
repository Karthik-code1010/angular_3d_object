import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeepObjectComponent } from './jeep-object.component';

describe('JeepObjectComponent', () => {
  let component: JeepObjectComponent;
  let fixture: ComponentFixture<JeepObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeepObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JeepObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
