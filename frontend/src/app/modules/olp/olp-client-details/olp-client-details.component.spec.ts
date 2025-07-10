import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpClientDetailsComponent } from './olp-client-details.component';

describe('OlpClientDetailsComponent', () => {
  let component: OlpClientDetailsComponent;
  let fixture: ComponentFixture<OlpClientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpClientDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
