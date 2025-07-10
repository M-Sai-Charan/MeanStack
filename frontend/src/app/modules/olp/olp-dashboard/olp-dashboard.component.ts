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
   olpData = {
    "EnquiryDetails": [
        {
            "EnquiryID": 1,
            "Bride": "one",
            "Groom": "one",
            "ContactNumber": "895665656",
            "Email": null,
            "comments": null,
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 2,
            "Bride": "one",
            "Groom": "two",
            "ContactNumber": "6301587956",
            "Email": "sunny@gmail.com",
            "comments": "hello",
            "Status": "In-Progress",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 3,
            "Bride": "Kavitha",
            "Groom": "Rajesh",
            "ContactNumber": "15649789",
            "Email": "rajesh@gmail.com",
            "comments": "Its a big event for me",
            "Status": "In-Progress",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 4,
            "Bride": "Kavitha",
            "Groom": "Rajesh",
            "ContactNumber": "15649789",
            "Email": "rajesh@gmail.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 5,
            "Bride": "Saritha",
            "Groom": "Roopesh",
            "ContactNumber": "15649789",
            "Email": "rajesh@gmail.com",
            "comments": "Its a big event for me",
            "Status": "In-Progress",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 6,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 7,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 8,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 9,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 10,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 12,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 15,
            "Bride": "Harika",
            "Groom": "Bharath",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": "2025-06-13T22:14:35.410",
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 16,
            "Bride": "Harika",
            "Groom": "Bharath",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": "2025-06-13T22:19:54.560",
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 17,
            "Bride": "Jaan",
            "Groom": "Janu",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": "2025-06-14T14:47:39.280",
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 11,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 13,
            "Bride": "Gayathri",
            "Groom": "Arun",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        },
        {
            "EnquiryID": 14,
            "Bride": "Jaan",
            "Groom": "Janu",
            "ContactNumber": "15649789",
            "Email": "Arun@onelook.com",
            "comments": "Its a big event for me",
            "Status": "New",
            "EnquirySubmissionDate": null,
            "ReferredFrom": null,
            "OLPID": null
        }
    ],
    "EventDetails": [
        {
            "EventDetailsID": 1,
            "EnquiryID": 3,
            "EventName": "Haldi",
            "Date": null,
            "Time": null,
            "Location": "MPL",
            "Guests": null
        },
        {
            "EventDetailsID": 2,
            "EnquiryID": 3,
            "EventName": "Reception",
            "Date": null,
            "Time": null,
            "Location": "Bangalore",
            "Guests": null
        },
        {
            "EventDetailsID": 3,
            "EnquiryID": 4,
            "EventName": "Haldi",
            "Date": null,
            "Time": null,
            "Location": "MPL",
            "Guests": 100
        },
        {
            "EventDetailsID": 4,
            "EnquiryID": 4,
            "EventName": "Reception",
            "Date": null,
            "Time": null,
            "Location": "Bangalore",
            "Guests": 200
        },
        {
            "EventDetailsID": 5,
            "EnquiryID": 5,
            "EventName": "Prewedding",
            "Date": "2025-05-21",
            "Time": "Morning",
            "Location": "MPL",
            "Guests": 10
        },
        {
            "EventDetailsID": 6,
            "EnquiryID": 5,
            "EventName": "Nalugu",
            "Date": "2025-05-21",
            "Time": "Evening",
            "Location": "Bangalore",
            "Guests": 50
        },
        {
            "EventDetailsID": 7,
            "EnquiryID": 6,
            "EventName": "Prewedding",
            "Date": "2025-05-21",
            "Time": "Morning",
            "Location": "MPL",
            "Guests": 10
        },
        {
            "EventDetailsID": 8,
            "EnquiryID": 6,
            "EventName": "Nalugu",
            "Date": "2025-05-21",
            "Time": "Evening",
            "Location": "Bangalore",
            "Guests": 50
        },
        {
            "EventDetailsID": 9,
            "EnquiryID": 7,
            "EventName": "Prewedding",
            "Date": "2025-05-21",
            "Time": "Morning",
            "Location": "MPL",
            "Guests": 10
        },
        {
            "EventDetailsID": 10,
            "EnquiryID": 7,
            "EventName": "Nalugu",
            "Date": "2025-05-21",
            "Time": "Evening",
            "Location": "Bangalore",
            "Guests": 50
        },
        {
            "EventDetailsID": 11,
            "EnquiryID": 8,
            "EventName": "Prewedding",
            "Date": "2025-05-21",
            "Time": "Morning",
            "Location": "MPL",
            "Guests": 10
        },
        {
            "EventDetailsID": 12,
            "EnquiryID": 8,
            "EventName": "Nalugu",
            "Date": "2025-05-21",
            "Time": "Evening",
            "Location": "Bangalore",
            "Guests": 50
        },
        {
            "EventDetailsID": 13,
            "EnquiryID": 9,
            "EventName": "Prewedding",
            "Date": "2025-05-21",
            "Time": "Morning",
            "Location": "MPL",
            "Guests": 10
        },
        {
            "EventDetailsID": 14,
            "EnquiryID": 9,
            "EventName": "Nalugu",
            "Date": "2025-05-21",
            "Time": "Evening",
            "Location": "Bangalore",
            "Guests": 50
        },
        {
            "EventDetailsID": 15,
            "EnquiryID": 16,
            "EventName": "Prewedding",
            "Date": "2025-05-21",
            "Time": "Morning",
            "Location": "MPL",
            "Guests": 10
        },
        {
            "EventDetailsID": 16,
            "EnquiryID": 16,
            "EventName": "Nalugu",
            "Date": "2025-05-21",
            "Time": "Evening",
            "Location": "Bangalore",
            "Guests": 50
        },
        {
            "EventDetailsID": 17,
            "EnquiryID": 17,
            "EventName": "Prewedding",
            "Date": "2025-05-21",
            "Time": "Morning",
            "Location": "MPL",
            "Guests": 10
        },
        {
            "EventDetailsID": 18,
            "EnquiryID": 17,
            "EventName": "Nalugu",
            "Date": "2025-05-21",
            "Time": "Evening",
            "Location": "Bangalore",
            "Guests": 50
        }
    ]
}
  ngOnInit(): void {
    console.log(this.getOLPData(this.olpData))
  }
  getOLPData(data:any){
    data.EnquiryDetails.forEach((element:any) => {
      const matchingEvents = data.EventDetails.filter((event:any) => {
        return event.EnquiryID === element.EnquiryID
      })
     element.events = matchingEvents
    });
    return data
  }
}
