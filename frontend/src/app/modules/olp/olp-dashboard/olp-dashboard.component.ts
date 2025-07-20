import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-olp-dashboard',
  templateUrl: './olp-dashboard.component.html',
  styleUrl: './olp-dashboard.component.css',
  standalone: false
})
export class OlpDashboardComponent implements OnInit {
  bookings = 1245;
  revenue = 82450;
  upcomingEvents = 23;
  rating = 4.8;

  topEmployees = [
    { name: 'Anya Gupta', completedEvents: 42 },
    { name: 'Rohan Das', completedEvents: 38 },
    { name: 'Maya Nair', completedEvents: 34 }
  ];

  topLocations = [
    { location: 'Mumbai', count: 68 },
    { location: 'Delhi', count: 52 },
    { location: 'Bangalore', count: 46 },
    { location: 'Hyderabad', count: 41 }
  ];

  eventCategories = [
    { label: 'Wedding', value: 70, color: 'wedding' },
    { label: 'Birthday', value: 35, color: 'birthday' },
    { label: 'Corporate', value: 50, color: 'corporate' },
    { label: 'Other', value: 20, color: 'other' }
  ];

  ngOnInit(): void {
    
  }
  get totalEvents(): number {
    return this.eventCategories.reduce((sum, e) => sum + e.value, 0);
  }

  getWidth(value: number): string {
    return `${(value / this.totalEvents) * 100}%`;
  }

  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Earnings',
        data: [12000, 15000, 13000, 17000, 18000],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        ticks: {
          color: '#888'
        },
        grid: {
          color: '#eee'
        }
      },
      x: {
        ticks: {
          color: '#888'
        },
        grid: {
          color: '#eee'
        }
      }
    }
  };
}


