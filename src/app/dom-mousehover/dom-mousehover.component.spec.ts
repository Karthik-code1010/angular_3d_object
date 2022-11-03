import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomMousehoverComponent } from './dom-mousehover.component';

describe('DomMousehoverComponent', () => {
  let component: DomMousehoverComponent;
  let fixture: ComponentFixture<DomMousehoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomMousehoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomMousehoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
