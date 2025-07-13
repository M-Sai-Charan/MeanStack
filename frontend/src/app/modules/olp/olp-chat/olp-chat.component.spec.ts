import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlpChatComponent } from './olp-chat.component';

describe('OlpChatComponent', () => {
  let component: OlpChatComponent;
  let fixture: ComponentFixture<OlpChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlpChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlpChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
