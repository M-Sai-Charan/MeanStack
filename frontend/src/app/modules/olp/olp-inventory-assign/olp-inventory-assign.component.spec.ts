import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpInventoryAssignComponent } from './olp-inventory-assign.component';

describe('OlpInventoryAssignComponent', () => {
  let component: OlpInventoryAssignComponent;
  let fixture: ComponentFixture<OlpInventoryAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpInventoryAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpInventoryAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
