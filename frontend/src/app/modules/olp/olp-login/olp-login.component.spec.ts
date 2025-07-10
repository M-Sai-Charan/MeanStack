import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpLoginComponent } from './olp-login.component';

describe('OlpLoginComponent', () => {
  let component: OlpLoginComponent;
  let fixture: ComponentFixture<OlpLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
