import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryMachineComponent } from './factory-machine.component';

describe('FactoryMachineComponent', () => {
  let component: FactoryMachineComponent;
  let fixture: ComponentFixture<FactoryMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoryMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
