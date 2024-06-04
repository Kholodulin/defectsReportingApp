import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ObjectModel } from '../../models/object-model';
import { Column } from '../../models/shared-models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table-template',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    CalendarModule,
    InputTextareaModule
  ],
  templateUrl: './table-template.component.html',
  styleUrl: './table-template.component.css'
})
export class TableTemplateComponent {
  @Input() isSelectBtn: boolean = false;
  @Input() isDelBtn: boolean = false;
  @Input() objects!: ObjectModel[];

  @Output() objectSelected = new EventEmitter<number>();
  @Output() objectToDelete = new EventEmitter<number>();

  cols: Column[] = [
    { field: 'name', header: 'name' },
    { field: 'address', header: 'address' },
    { field: 'registrationDate', header: 'registrationDate' },
    { field: 'requestsCount', header: 'requestsCount' }
  ];


  selectObject(id: number) {
    this.objectSelected.emit(id);
  }
  deleteObject(id: number) {
    this.objectToDelete.emit(id);
  }
}
