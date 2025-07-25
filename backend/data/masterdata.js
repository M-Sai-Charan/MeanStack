// backend/data/masterdata.js

const masterData = {
  eventTypes: [
    "Muhurtham",
    "Engagement",
    "Pre-wedding shoot",
    "Bride Mangalsnanam",
    "Groom Mangalsnanam",
    "Bride Nalugu",
    "Groom Nalugu",
    "Mehandi",
    "Sangeeth",
    "Reception"
  ],
  sources: ["Instagram", "Facebook", "Others"],
  eventTimes: [
    "Early Morning",
    "Afternoon",
    "Evening",
    "Night"
  ],
  callStatus: [
    "New",
    "Pending",
    "Rejected",
    "Approved",
    "Blocked"
  ],
  userStatus:[
    "New",
    "Pending",
    "Rejected",
    "Approved",
    "Blocked"
  ],
  callInitiates: [
    "John",
    "Mike",
    "Ellse",
    "Smith",
    "Warner",
    "Perry",
    "Derk"
  ],
  invoiceStatus: [
    "New",
    "In-progress",
    "Closed",
    "Pending"
  ],
  teamMembers: [
    // Photographers
    { name: "Ravi", role: "Photographer" },
    { name: "Ajay", role: "Photographer" },
    { name: "Sneha", role: "Photographer" },

    // Cinematographers
    { name: "Meena", role: "Cinematographer" },
    { name: "Karan", role: "Cinematographer" },
    { name: "Ruchi", role: "Cinematographer" },

    // Drone Operators
    { name: "Sunny", role: "Drone Operator" },
    { name: "Varun", role: "Drone Operator" },
    { name: "Diya", role: "Drone Operator" },

    // Lighting Crew
    { name: "Anu", role: "Lighting Assistant" },
    { name: "Mohan", role: "Lighting Assistant" },
    { name: "Priya", role: "Lighting Assistant" },

    // Candid Photography
    { name: "David", role: "Candid Photographer" },
    { name: "Sara", role: "Candid Photographer" },
    { name: "Manoj", role: "Candid Photographer" },

    // Album Designers
    { name: "Alok", role: "Album Designer" },
    { name: "Geeta", role: "Album Designer" },
    { name: "Faiz", role: "Album Designer" },

    // Field Coordinators
    { name: "Shweta", role: "Event Coordinator" },
    { name: "Nikhil", role: "Event Coordinator" },
    { name: "Neha", role: "Event Coordinator" },

    // Sound Technicians
    { name: "Ramesh", role: "Sound Technician" },
    { name: "Deepika", role: "Sound Technician" },
    { name: "Tushar", role: "Sound Technician" },

    // Logistics/Setup Crew
    { name: "Irfan", role: "Logistics & Setup" },
    { name: "Vikas", role: "Logistics & Setup" },
    { name: "Laxmi", role: "Logistics & Setup" },

    // Crowd Handlers
    { name: "Anita", role: "Crowd Handler" },
    { name: "Raj", role: "Crowd Handler" },
    { name: "Bhavana", role: "Crowd Handler" },

    // Backup/Support Staff
    { name: "Chintu", role: "Support Staff" },
    { name: "Pooja", role: "Support Staff" },
    { name: "Sagar", role: "Support Staff" }
  ],
  inventoryMasters: [
    {
      role: "Photographer",
      inventory: [
        "DSLR Camera",
        "Prime Lens",
        "Zoom Lens",
        "Tripod"
      ]
    },
    {
      role: "Cinematographer",
      inventory: [
        "Cinema Camera",
        "Gimbal",
        "Audio Recorder"
      ]
    },
    {
      role: "Drone Operator",
      inventory: [
        "Drone Kit",
        "Extra Batteries"
      ]
    },
    {
      role: "Lighting Assistant",
      inventory: [
        "LED Light Panel",
        "Power Cable",
        "Light Stands"
      ]
    },
    {
      role: "Sound Technician",
      inventory: [
        "Wireless Mic Set",
        "Boom Mic",
        "Audio Mixer"
      ]
    },
    {
      role: "Logistics & Setup",
      inventory: [
        "Decor Props Kit",
        "Support Poles",
        "Tent Kit"
      ]
    },
    {
      role: "Crowd Handler",
      inventory: [
        "Walkie Talkie",
        "ID Badge"
      ]
    },
    {
      role: "Support Staff",
      inventory: [
        "Utility Bag",
        "Water Bottles"
      ]
    },
    {
      role: "Candid Photographer",
      inventory: ["DSLR Camera", "Prime Lens", "Portrait Lens", "Reflector Kit"]
    },
    {
      role: "Album Designer",
      inventory: ["Laptop", "Adobe Lightroom", "Photo Backup Drive", "Design Templates"]
    },
    {
      role: "Event Coordinator",
      inventory: ["Walkie Talkie", "Schedule Book", "Checklist Clipboard", "Pen Set"]
    }
  ],
  roles: [
    {
      name: "Admin",
      description: "Full access to all modules and permissions",
      accessibleRoutes: [
        "/dashboard",
        "/users",
        "/invoice",
        "/budget",
        "/team-assign",
        "/inventory-assign",
        "/clients",
        "/admin"
      ]
    },
    {
      name: "HR",
      description: "Manages employees, enquiries, invoices",
      accessibleRoutes: [
        "/dashboard",
        "/users",
        "/invoice",
        "/clients"
      ]
    },
    {
      name: "Production Lead",
      description: "Approves budgets and assigns teams",
      accessibleRoutes: [
        "/dashboard",
        "/budget",
        "/team-assign",
        "/inventory-assign"
      ]
    },
    {
      name: "Photographer",
      description: "Handles photography tasks",
      accessibleRoutes: [
        "/dashboard",
        "/clients"
      ]
    },
    {
      name: "Editor",
      description: "Edits and uploads final deliverables",
      accessibleRoutes: [
        "/dashboard"
      ]
    },
    {
      name: "Coordinator",
      description: "Handles client interaction and schedule",
      accessibleRoutes: [
        "/dashboard",
        "/clients",
        "/team-assign"
      ]
    }
  ],

  uiRoutes: [
    { label: "Dashboard", icon: "pi pi-home", route: "/dashboard" },
    { label: "Users", icon: "pi pi-users", route: "/users" },
    { label: "Invoice", icon: "pi pi-receipt", route: "/invoice" },
    { label: "Budget", icon: "pi pi-wallet", route: "/budget" },
    { label: "Team Assign", icon: "pi pi-clipboard", route: "/team-assign" },
    { label: "Inventory Assign", icon: "pi pi-warehouse", route: "/inventory-assign" },
    { label: "Clients", icon: "pi pi-users", route: "/clients" },
    { label: "Admin", icon: "pi pi-cog", route: "/admin" },
    { label: "Enquiry Form", icon: "pi-cloud", route: "/enquiry-form" },
  ],
  teams: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']
};

module.exports = masterData;
