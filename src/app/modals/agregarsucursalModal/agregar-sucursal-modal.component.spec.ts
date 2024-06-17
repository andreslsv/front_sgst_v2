import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSucursalModalComponent } from './agregar-sucursal-modal.component';

describe('AgregarSucursalModalComponent', () => {
  let component: AgregarSucursalModalComponent;
  let fixture: ComponentFixture<AgregarSucursalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarSucursalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarSucursalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
