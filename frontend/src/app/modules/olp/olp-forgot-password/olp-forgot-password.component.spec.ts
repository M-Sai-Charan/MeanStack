import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpForgotPasswordComponent } from './olp-forgot-password.component';

describe('OlpForgotPasswordComponent', () => {
  let component: OlpForgotPasswordComponent;
  let fixture: ComponentFixture<OlpForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
