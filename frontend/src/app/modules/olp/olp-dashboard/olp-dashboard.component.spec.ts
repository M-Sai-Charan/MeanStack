import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpDashboardComponent } from './olp-dashboard.component';

describe('OlpDashboardComponent', () => {
  let component: OlpDashboardComponent;
  let fixture: ComponentFixture<OlpDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
