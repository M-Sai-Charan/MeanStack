import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OlpService } from '../olp.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-olp-admin',
  templateUrl: './olp-admin.component.html',
  styleUrl: './olp-admin.component.css',
  standalone: false,
  providers: [MessageService]
})
export class OlpAdminComponent implements OnInit {
  adminForm: FormGroup;
  teams = [
    { name: 'Team A', value: 'A' },
    { name: 'Team B', value: 'B' },
    { name: 'Team C', value: 'C' },
    { name: 'Team D', value: 'D' },
    { name: 'Team E', value: 'E' }
  ];
  roles = [];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  statuses = ['Active', 'Inactive', 'On Leave'];
  genders = [
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' },
    { name: 'Other', value: 'Other' }
  ];
  Routes = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Users', icon: 'pi pi-users', route: '/users' },
    { label: 'Invoice', icon: 'pi pi-receipt', route: '/invoice' },
    { label: 'Budget', icon: 'pi pi-wallet', route: '/budget' },
    { label: 'Team Assign', icon: 'pi pi-clipboard', route: '/team-assign' },
    { label: 'Inventory Assign', icon: 'pi pi-warehouse', route: '/inventory-assign' },
    { label: 'Clients', icon: 'pi pi-users', route: '/clients' },
    { label: 'Admin', icon: 'pi-cog', route: '/admin' },
  ];

  profilePicPreview: string | ArrayBuffer | null = null;
  isSubmitted = false;
  olpEmployees: any = [];
  employeeHeader: any;
  showemployeeHeader = false;
  selectedUserData: any;
  olpEmployeeMode: any = 'Add';
  loading: boolean = false;
  constructor(private fb: FormBuilder, private olpService: OlpService, private messageService: MessageService) {
    this.adminForm = this.fb.group({
      profilePic: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      joiningDate: ['', Validators.required],
      exitDate: [''],
      role: ['', Validators.required],
      routes: ['', Validators.required],
      team: ['', Validators.required],
      aadhar: ['', Validators.required],
      pan: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      emergencyName: ['', Validators.required],
      emergencyRelation: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getOLPEmployees();
    this.getOLPMaster();
  }

  getOLPEmployees() {
    this.loading = true;
    this.olpService.getAllOLPEnquires('employee').subscribe({
      next: (data: any) => {
        this.olpEmployees = data || [];
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getOLPMaster() {
    this.olpService.getOLPMaster('OlpMaster/getOlpMaster').subscribe((data: any) => {
      this.roles = data.roles;
    });
  }

  isInvalid(field: string): boolean {
    const control = this.adminForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched || this.isSubmitted));
  }

  submitForm() {
    this.isSubmitted = true;

    if (this.adminForm.valid) {
      const employeeData = this.convertOLPEmployee(this.adminForm.value, this.olpEmployeeMode);

      // Set the correct API URL based on the mode
      const endpoint = this.olpEmployeeMode === 'Add' ? 'Employee/create' : `Employee/update`;

      this.olpService.saveOLPEmployee(endpoint, employeeData, this.olpEmployeeMode).subscribe(
        (res: any) => {
          this.messageService.add({
            severity: 'success', summary: 'Success',
            detail: this.olpEmployeeMode === 'Add' ? 'Employee saved successfully!' : 'Employee updated successfully!'
          });
          this.getOLPEmployees();
          this.adminForm.reset();
          this.isSubmitted = false;
          this.showemployeeHeader = false;
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save employee.' });
          this.getOLPEmployees();
          this.adminForm.reset();
          this.isSubmitted = false;
          this.showemployeeHeader = false;
        }
      );
    }
  }


  onReset() {
    this.adminForm.reset();
    this.isSubmitted = false;
    this.olpEmployeeMode = 'Add';
  }

  onAddNewEmployee() {
    this.showemployeeHeader = true;
    this.employeeHeader = 'Add New Employee';
    this.olpEmployeeMode = 'Add';
  }

  selectOLPEmployee(employee: any) {
    this.showemployeeHeader = true;
    this.employeeHeader = 'Edit Employee';
    this.olpEmployeeMode = 'Edit';
    this.selectedUserData = employee;

    this.profilePicPreview = employee.profilePic
      ? employee.profilePic.startsWith('data:image')
        ? employee.profilePic
        : `data:image/jpeg;base64,${employee.profilePic}`
      : null;

    this.adminForm.patchValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      joiningDate: new Date(employee.joiningDate),
      exitDate: employee.exitDate ? new Date(employee.exitDate) : null,
      role: {
        id: `${employee.role?.id}`,
        name: employee.role?.name,
        description: employee.role?.description,
      },
      routes: employee.allowedRoutes,
      team: employee.teamId,
      aadhar: employee.aadhar,
      pan: employee.pan,
      bloodGroup: employee.bloodGroup,
      gender: employee.gender,
      dob: new Date(employee.dob),
      emergencyName: employee.emergencyContact?.name,
      emergencyRelation: employee.emergencyContact?.relation,
      emergencyPhone: employee.emergencyContact?.phone,
      profilePic: employee.profilePic?.startsWith('data:image')
        ? employee.profilePic.split(',')[1]
        : employee.profilePic || ''
    });
  }

  convertOLPEmployee(olpEmployee: any, mode: any): any {
    const rawProfilePic = this.adminForm.get('profilePic')?.value || '';
    const profilePicWithPrefix =
      rawProfilePic && !rawProfilePic.startsWith('data:image')
        ? `data:image/jpeg;base64,${rawProfilePic}`
        : rawProfilePic;
    const data = mode === 'Add' ? {} : {
      id: this.selectedUserData ? this.selectedUserData?.id : '',
      photographerId: this.selectedUserData ? this.selectedUserData?.photographerId : '',
      secretCode: this.selectedUserData ? this.selectedUserData?.secretCode : '',
    }
    return {
      ...data,
      name: olpEmployee.name,
      email: olpEmployee.email,
      phone: olpEmployee.phone,
      address: olpEmployee.address,
      joiningDate: olpEmployee.joiningDate,
      exitDate: olpEmployee.exitDate || null,
      role: {
        id: +olpEmployee.role.id,
        name: olpEmployee.role.name,
        description: olpEmployee.role.description
      },
      allowedRoutes: olpEmployee.routes.map((r: any) => ({
        label: r.label,
        icon: r.icon,
        route: r.route
      })),
      teamId: {
        name: olpEmployee.team.name,
        value: olpEmployee.team.value
      },
      aadhar: olpEmployee.aadhar,
      pan: olpEmployee.pan,
      bloodGroup: olpEmployee.bloodGroup,
      gender: {
        name: olpEmployee.gender.name,
        value: olpEmployee.gender.value
      },
      dob: olpEmployee.dob,
      emergencyContact: {
        name: olpEmployee.emergencyName,
        relation: olpEmployee.emergencyRelation,
        phone: olpEmployee.emergencyPhone
      },
      profilePic: profilePicWithPrefix
    };
  }

  onProfilePicUpload(event: any) {
    const file: File = event.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result as string;
      this.profilePicPreview = base64Image;
      const base64String = base64Image.split(',')[1];
      this.adminForm.get('profilePic')?.setValue(base64String);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  removeProfilePic() {
    this.profilePicPreview = null;
    this.adminForm.get('profilePic')?.setValue('');
  }
}
