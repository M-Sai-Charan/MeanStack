import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpEnquiryFormComponent } from './olp-enquiry-form.component';

describe('OlpEnquiryFormComponent', () => {
  let component: OlpEnquiryFormComponent;
  let fixture: ComponentFixture<OlpEnquiryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpEnquiryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpEnquiryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
