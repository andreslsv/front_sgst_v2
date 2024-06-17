import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidarNuevaNominaComponent } from './liquidar-nueva-nomina.component';

describe('LiquidarNuevaNominaComponent', () => {
  let component: LiquidarNuevaNominaComponent;
  let fixture: ComponentFixture<LiquidarNuevaNominaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidarNuevaNominaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidarNuevaNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
