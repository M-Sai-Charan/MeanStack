import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpInventoryComponent } from './olp-inventory.component';

describe('OlpInventoryComponent', () => {
  let component: OlpInventoryComponent;
  let fixture: ComponentFixture<OlpInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
