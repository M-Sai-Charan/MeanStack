import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OlpDashboardComponent } from './olp-dashboard/olp-dashboard.component';
import { OlpUsersComponent } from './olp-users/olp-users.component';
import { OlpMenuComponent } from './olp-menu/olp-menu.component';
import { OlpLoginComponent } from './olp-login/olp-login.component';
import { OlpEmployeesComponent } from './olp-employees/olp-employees.component';
import { OlpAdminComponent } from './olp-admin/olp-admin.component';
import { OlpBudgetComponent } from './olp-budget/olp-budget.component';
import { OlpInventoryComponent } from './olp-inventory/olp-inventory.component';
import { OlpTeamAssignComponent } from '../../olp-team-assign/olp-team-assign.component';
import { OlpInvoiceComponent } from './olp-invoice/olp-invoice.component';
import { OlpTasksComponent } from './olp-tasks/olp-tasks.component';
import { OlpInventoryAssignComponent } from './olp-inventory-assign/olp-inventory-assign.component';
import { OlpClientDetailsComponent } from './olp-client-details/olp-client-details.component';
import { RoleGuard } from '../../guards/role.guard';
import { OlpClientTemplateComponent } from './olp-client-template/olp-client-template.component';
import { OlpEnquiryFormComponent } from './olp-enquiry-form/olp-enquiry-form.component';
import { OlpChatComponent } from './olp-chat/olp-chat.component';
import { OlpSettingsComponent } from './olp-settings/olp-settings.component';
const routes: Routes = [
  { path: '', component: OlpLoginComponent },
  { path: 'login', component: OlpLoginComponent },
   { path: 'clientsTemplate/:id', component: OlpClientTemplateComponent },
  {
    path: '',
    component: OlpMenuComponent,
    children: [
      { path: 'dashboard', component: OlpDashboardComponent, canActivate: [RoleGuard] },
      { path: 'users', component: OlpUsersComponent, canActivate: [RoleGuard] },
      { path: 'employees', component: OlpEmployeesComponent, canActivate: [RoleGuard] },
      { path: 'admin', component: OlpAdminComponent, canActivate: [RoleGuard] },
      { path: 'budget', component: OlpBudgetComponent, canActivate: [RoleGuard] },
      { path: 'inventory', component: OlpInventoryComponent, canActivate: [RoleGuard] },
      { path: 'team-assign', component: OlpTeamAssignComponent, canActivate: [RoleGuard] },
      { path: 'inventory-assign', component: OlpInventoryAssignComponent, canActivate: [RoleGuard] },
      { path: 'invoice', component: OlpInvoiceComponent, canActivate: [RoleGuard] },
      { path: 'tasks', component: OlpTasksComponent, canActivate: [RoleGuard] },
      { path: 'clients', component: OlpClientDetailsComponent, canActivate: [RoleGuard] },
      // { path: 'clientsTemplate/:id', component: OlpClientTemplateComponent, canActivate: [RoleGuard] },
      { path: 'enquiry-form', component: OlpEnquiryFormComponent, canActivate: [RoleGuard] },
      { path: 'chat', component: OlpChatComponent, canActivate: [RoleGuard] },
      { path: 'settings', component: OlpSettingsComponent, canActivate: [RoleGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OlpRoutingModule { }
