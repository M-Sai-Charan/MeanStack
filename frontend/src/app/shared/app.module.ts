import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { MultiSelectModule } from 'primeng/multiselect';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToolbarModule } from 'primeng/toolbar';
import { AccordionModule } from 'primeng/accordion';
import { ChipModule } from 'primeng/chip';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { TabViewModule } from 'primeng/tabview';
import { SelectModule } from 'primeng/select';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { AuthService } from '../services/auth.service';
import { RoleGuard } from '../guards/role.guard';
@NgModule({
    declarations: [
        CustomToastComponent
    ],
    imports: [
        ButtonModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        FloatLabel,
        RouterModule,
        ReactiveFormsModule,
        TableModule,
        CardModule,
        ChartModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        OrganizationChartModule,
        DialogModule,
        CheckboxModule,
        DividerModule,
        PanelModule,
        AvatarModule,
        DropdownModule,
        ProgressBarModule,
        InputTextarea,
        MessageModule,
        InputNumberModule,
        CalendarModule,
        ToastModule,
        ConfirmDialogModule,
        MenuModule,
        TooltipModule,
        SidebarModule,
        BadgeModule,
        MultiSelectModule,
        DragDropModule,
        ToolbarModule,
        AccordionModule,
        ChipModule,
        FullCalendarModule,
        HttpClientModule,
        TabViewModule,
        SelectModule,
        ColorPickerModule,
        FieldsetModule,
        FileUploadModule,
        SkeletonModule,
        DatePickerModule,
        RadioButtonModule,
        CommonModule
    ],
    exports: [
        CustomToastComponent,
        ButtonModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        FloatLabel,
        RouterModule,
        ReactiveFormsModule,
        TableModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        OrganizationChartModule,
        DialogModule,
        CheckboxModule,
        DividerModule,
        PanelModule,
        AvatarModule,
        DropdownModule,
        CardModule,
        ChartModule,
        ProgressBarModule,
        InputTextarea,
        MessageModule,
        InputNumberModule,
        CalendarModule,
        ToastModule,
        ConfirmDialogModule,
        MenuModule,
        TooltipModule,
        SidebarModule,
        BadgeModule,
        MultiSelectModule,
        DragDropModule,
        ToolbarModule,
        AccordionModule,
        ChipModule,
        FullCalendarModule,
        HttpClientModule,
        TabViewModule,
        SelectModule,
        ColorPickerModule,
        FieldsetModule,
        FileUploadModule,
        SkeletonModule,
        DatePickerModule,
        RadioButtonModule,
    ],
    providers: [HttpService, AuthService,RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
    bootstrap: []
})
export class SharedModule { }
