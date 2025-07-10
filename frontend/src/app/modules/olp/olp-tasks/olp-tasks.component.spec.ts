import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpTasksComponent } from './olp-tasks.component';

describe('OlpTasksComponent', () => {
  let component: OlpTasksComponent;
  let fixture: ComponentFixture<OlpTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
