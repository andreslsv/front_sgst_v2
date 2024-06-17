import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsstComponent } from './sgsst.component';

describe('SgsstComponent', () => {
  let component: SgsstComponent;
  let fixture: ComponentFixture<SgsstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SgsstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
