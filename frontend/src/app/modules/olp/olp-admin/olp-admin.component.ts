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
  teams = [];
  roles = [];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = ['Male', 'Female', 'Other'];
  Routes = [];
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
    this.getOLPMasterData();
  }
  getOLPEmployees() {
    this.loading = true;
    this.olpService.getAllOLPEnquires('employees').subscribe({
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
  getOLPMasterData() {
    this.olpService.getOLPMaster('masterdata').subscribe((res: any) => {
      this.roles = res.data.roles;
      this.Routes = res.data.uiRoutes;
      this.teams = res.data.teams;
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
      const endpoint = this.olpEmployeeMode === 'Add' ? '/employees' : `/employees`;
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
    console.log(employee)
    this.showemployeeHeader = true;
    this.employeeHeader = 'Edit Employee';
    this.olpEmployeeMode = 'Edit';
    this.selectedUserData = employee;
    this.profilePicPreview = employee.profilePic || null;
    this.adminForm.patchValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      joiningDate: new Date(employee.joiningDate),
      exitDate: employee.exitDate ? new Date(employee.exitDate) : null,
      role: this.findRole(employee.role),
      routes: this.findRoutes(employee.allowedRoutes),
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
    const data = mode === 'Add' ? {} : {
      _id: this.selectedUserData ? this.selectedUserData?._id : '',
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
      role: olpEmployee.role.name,
      allowedRoutes: olpEmployee.routes.map((r: any) => ({
        label: r.label,
        icon: r.icon,
        route: r.route
      })),
      teamId: olpEmployee.team.name,
      aadhar: olpEmployee.aadhar,
      pan: olpEmployee.pan,
      bloodGroup: olpEmployee.bloodGroup,
      gender: olpEmployee.gender,
      dob: olpEmployee.dob,
      emergencyContact: {
        name: olpEmployee.emergencyName,
        relation: olpEmployee.emergencyRelation,
        phone: olpEmployee.emergencyPhone
      },
      profilePic: olpEmployee.profilePic
    };
  }
  onProfilePicUpload(event: any) {
    const file: File = event.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePic', file);
    this.olpService.uploadProfilePic('http://localhost:5000', formData).subscribe({
      next: (res: any) => {
        this.profilePicPreview = res.url;
        this.adminForm.get('profilePic')?.setValue(res.url);
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Image upload failed' });
      }
    });
  }
  removeProfilePic() {
    this.profilePicPreview = null;
    this.adminForm.get('profilePic')?.setValue('');
  }
  findRole(name: any) {
    const roleData = this.roles.find((val: any) => val.name === name)
    return roleData
  }
  findRoutes(names: any) {
    const routeData = names.map((val: any) => {
      return {
        label: val.label,
        icon: val.icon,
        route: val.route,
      }
    })
    return routeData
  }
}
