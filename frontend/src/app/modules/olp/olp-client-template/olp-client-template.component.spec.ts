import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpClientTemplateComponent } from './olp-client-template.component';

describe('OlpClientTemplateComponent', () => {
  let component: OlpClientTemplateComponent;
  let fixture: ComponentFixture<OlpClientTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpClientTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpClientTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
