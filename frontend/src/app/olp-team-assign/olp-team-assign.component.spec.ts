import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpTeamAssignComponent } from './olp-team-assign.component';

describe('OlpTeamAssignComponent', () => {
  let component: OlpTeamAssignComponent;
  let fixture: ComponentFixture<OlpTeamAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpTeamAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpTeamAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
