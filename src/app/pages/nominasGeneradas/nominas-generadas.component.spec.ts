import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NominasGeneradasComponent } from './nominas-generadas.component';

describe('NominasGeneradasComponent', () => {
  let component: NominasGeneradasComponent;
  let fixture: ComponentFixture<NominasGeneradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NominasGeneradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NominasGeneradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
