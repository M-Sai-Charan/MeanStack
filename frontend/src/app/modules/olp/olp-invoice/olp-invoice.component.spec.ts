import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpInvoiceComponent } from './olp-invoice.component';

describe('OlpInvoiceComponent', () => {
  let component: OlpInvoiceComponent;
  let fixture: ComponentFixture<OlpInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
