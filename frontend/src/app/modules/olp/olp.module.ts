import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OlpRoutingModule } from './olp-routing.module';
import { OlpDashboardComponent } from './olp-dashboard/olp-dashboard.component';
import { OlpUsersComponent } from './olp-users/olp-users.component';
import { SharedModule } from '../../shared/app.module';
import { OlpMenuComponent } from './olp-menu/olp-menu.component';
import { OlpLoginComponent } from './olp-login/olp-login.component';
import { OlpEmployeesComponent } from './olp-employees/olp-employees.component';
import { OlpAdminComponent } from './olp-admin/olp-admin.component';
import { OlpBudgetComponent } from './olp-budget/olp-budget.component';
import { OlpInventoryComponent } from './olp-inventory/olp-inventory.component';
import { OlpTeamAssignComponent } from '../../olp-team-assign/olp-team-assign.component';
import { OlpInvoiceComponent } from './olp-invoice/olp-invoice.component';
import { OlpTasksComponent } from './olp-tasks/olp-tasks.component';
import { OlpService } from './olp.service';
import { OlpInventoryAssignComponent } from './olp-inventory-assign/olp-inventory-assign.component';
import { OlpClientDetailsComponent } from './olp-client-details/olp-client-details.component';
import { OlpClientTemplateComponent } from './olp-client-template/olp-client-template.component';
import { OlpEnquiryFormComponent } from './olp-enquiry-form/olp-enquiry-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { OlpChatComponent } from './olp-chat/olp-chat.component';
import { FilterByOLPIDPipe } from './pipes/filter-by-olpid.pipe';
import { OlpSettingsComponent } from './olp-settings/olp-settings.component';
@NgModule({
  declarations: [
    OlpDashboardComponent,
    OlpUsersComponent,
    OlpMenuComponent,
    OlpLoginComponent,
    OlpEmployeesComponent,
    OlpAdminComponent,
    OlpBudgetComponent,
    OlpInventoryComponent,
    OlpTeamAssignComponent,
    OlpInvoiceComponent,
    OlpTasksComponent,
    OlpInventoryAssignComponent,
    OlpClientDetailsComponent,
    OlpClientTemplateComponent,
    OlpEnquiryFormComponent,
    OlpChatComponent,
    OlpSettingsComponent,    
    FilterByOLPIDPipe
  ],
  imports: [
    CommonModule,
    OlpRoutingModule,
    SharedModule,
     MatButtonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
  ],
  providers: [OlpService,FilterByOLPIDPipe]
})
export class OlpModule { }
