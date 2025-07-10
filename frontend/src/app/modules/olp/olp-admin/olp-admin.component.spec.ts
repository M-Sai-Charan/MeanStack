import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpAdminComponent } from './olp-admin.component';

describe('OlpAdminComponent', () => {
  let component: OlpAdminComponent;
  let fixture: ComponentFixture<OlpAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
