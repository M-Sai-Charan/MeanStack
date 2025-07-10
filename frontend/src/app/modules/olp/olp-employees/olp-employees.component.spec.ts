import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpEmployeesComponent } from './olp-employees.component';

describe('OlpEmployeesComponent', () => {
  let component: OlpEmployeesComponent;
  let fixture: ComponentFixture<OlpEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
