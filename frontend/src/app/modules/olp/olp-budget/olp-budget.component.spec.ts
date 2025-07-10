import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpBudgetComponent } from './olp-budget.component';

describe('OlpBudgetComponent', () => {
  let component: OlpBudgetComponent;
  let fixture: ComponentFixture<OlpBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
