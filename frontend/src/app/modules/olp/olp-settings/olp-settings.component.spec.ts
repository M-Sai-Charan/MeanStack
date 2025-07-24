import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpSettingsComponent } from './olp-settings.component';

describe('OlpSettingsComponent', () => {
  let component: OlpSettingsComponent;
  let fixture: ComponentFixture<OlpSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
