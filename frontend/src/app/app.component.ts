import { SharedModule } from './shared/app.module';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(
  ) {}

  ngOnInit(): void {
   
  }
}
