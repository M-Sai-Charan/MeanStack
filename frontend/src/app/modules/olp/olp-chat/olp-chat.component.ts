import { Component, OnInit } from '@angular/core';
import { OlpService } from '../olp.service';

@Component({
  selector: 'app-olp-chat',
  templateUrl: './olp-chat.component.html',
  styleUrls: ['./olp-chat.component.css'],
  standalone: false
})
export class OlpChatComponent implements OnInit {
  constructor(
    private olpService: OlpService
  ) {}

  ngOnInit(): void {}
}
