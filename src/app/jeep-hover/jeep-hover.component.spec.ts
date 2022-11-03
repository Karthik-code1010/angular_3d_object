import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeepHoverComponent } from './jeep-hover.component';

describe('JeepHoverComponent', () => {
  let component: JeepHoverComponent;
  let fixture: ComponentFixture<JeepHoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeepHoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JeepHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
