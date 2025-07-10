import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpMenuComponent } from './olp-menu.component';

describe('OlpMenuComponent', () => {
  let component: OlpMenuComponent;
  let fixture: ComponentFixture<OlpMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
