import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBeneficiarioModalComponent } from './info-beneficiario-modal.component';

describe('InfoBeneficiarioModalComponent', () => {
  let component: InfoBeneficiarioModalComponent;
  let fixture: ComponentFixture<InfoBeneficiarioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBeneficiarioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBeneficiarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
