import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalJeepComponent } from './final-jeep.component';

describe('FinalJeepComponent', () => {
  let component: FinalJeepComponent;
  let fixture: ComponentFixture<FinalJeepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalJeepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalJeepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
