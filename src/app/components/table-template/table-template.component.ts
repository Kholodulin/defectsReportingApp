import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObjectModel } from '../../models/object-model';
import { Column } from '../../models/shared-models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
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
    InputTextModule,
    FormsModule,
    InputTextareaModule
  ],
  templateUrl: './table-template.component.html',
  styleUrl: './table-template.component.css'
})
export class TableTemplateComponent {
  @Input() isSelect: boolean = false;
  @Input() isEdit: boolean = false;
  @Input() objects!: ObjectModel[];

  @Output() objectSelected = new EventEmitter<number>();
  @Output() objectToEdit = new EventEmitter<number>();
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
  editObject(id: number) {
    this.objectToEdit.emit(id);
  }
  deleteObject(id: number) {
    this.objectToDelete.emit(id);
  }

}
