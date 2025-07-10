import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpUsersComponent } from './olp-users.component';

describe('OlpUsersComponent', () => {
  let component: OlpUsersComponent;
  let fixture: ComponentFixture<OlpUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
