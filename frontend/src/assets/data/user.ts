export const USERS = [
  {
    photographerId: 'team001',
    secretCode: '1234',
    name: 'Client Support',
    userName: 'Jack',
    email: 'jack@olpmedia.com',
    phone: '+91-9000011111',
    address: 'Hyderabad, Telangana',
    joiningDate: '2023-06-01',
    role: 'client_support_team',
    designation: 'Support Specialist',
    allowedRoutes: ['/users', '/clients'],
    teamId: 'T-01',
    employeeType: 'full-time',
    status: 'active',
    profilePic: '/assets/employees/jack.jpg',
    gender: 'male',
    notes: 'Handles client queries efficiently.',
    rating: 4.3
  },
  {
    photographerId: 'team002',
    secretCode: '5678',
    name: 'Invoice Handler',
    userName: 'kiran',
    email: 'kiran@olpmedia.com',
    phone: '+91-9000022222',
    address: 'Bangalore, Karnataka',
    joiningDate: '2023-07-15',
    role: 'invoice_team',
    designation: 'Accounts Executive',
    allowedRoutes: ['/invoice'],
    teamId: 'T-02',
    employeeType: 'full-time',
    status: 'active',
    profilePic: '/assets/employees/kiran.jpg',
    gender: 'male',
    notes: '',
    rating: 4.0
  },
  {
    photographerId: 'team003',
    secretCode: '9999',
    name: 'Budget Reviewer',
    userName: 'sai',
    email: 'sai@olpmedia.com',
    phone: '+91-9000033333',
    address: 'Chennai, Tamil Nadu',
    joiningDate: '2023-10-10',
    role: 'budget_team',
    designation: 'Senior Budget Analyst',
    allowedRoutes: ['/budget', '/invoice'],
    teamId: 'T-03',
    employeeType: 'full-time',
    status: 'active',
    profilePic: '/assets/employees/sai.jpg',
    gender: 'male',
    notes: 'Great performance in FY24 Q1. Give more responsibilities.',
    rating: 4.5
  },
  {
    photographerId: 'team004',
    secretCode: 'abcd',
    name: 'Team Manager',
    userName: 'sri',
    email: 'sri@olpmedia.com',
    phone: '+91-9000044444',
    address: 'Vijayawada, AP',
    joiningDate: '2023-03-01',
    role: 'team_assignment_team',
    designation: 'Operations Manager',
    allowedRoutes: ['/team-assign'],
    teamId: 'T-04',
    employeeType: 'full-time',
    status: 'active',
    profilePic: '/assets/employees/sri.jpg',
    gender: 'female',
    notes: 'Manages on-ground team logistics.',
    rating: 4.7
  },
  {
    photographerId: 'team005',
    secretCode: 'efgh',
    name: 'Inventory Manager',
    userName: 'charan',
    email: 'charan@olpmedia.com',
    phone: '+91-9000055555',
    address: 'Warangal, Telangana',
    joiningDate: '2022-11-20',
    role: 'inventory_team',
    designation: 'Inventory Coordinator',
    allowedRoutes: ['/inventory', '/inventory-assign'],
    teamId: 'T-05',
    employeeType: 'full-time',
    status: 'active',
    profilePic: '/assets/employees/charan.jpg',
    gender: 'male',
    notes: 'Keeps all equipment logs updated.',
    rating: 4.2
  },
  {
    photographerId: 'admin',
    secretCode: 'admin123',
    name: 'Admin',
    userName: 'sunny',
    email: 'sunny@olpmedia.com',
    phone: '+91-9999999999',
    address: 'Olp HQ, India',
    joiningDate: '2021-01-01',
    role: 'admin',
    designation: 'Super Admin',
    allowedRoutes: ['*'],
    teamId: 'ADMIN',
    employeeType: 'full-time',
    status: 'active',
    profilePic: '/assets/employees/sunny.jpg',
    gender: 'male',
    notes: 'Full access to all modules.',
    rating: 5.0
  }
];
