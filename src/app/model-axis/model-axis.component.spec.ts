import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelAxisComponent } from './model-axis.component';

describe('ModelAxisComponent', () => {
  let component: ModelAxisComponent;
  let fixture: ComponentFixture<ModelAxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelAxisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
