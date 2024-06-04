import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ObjectModel } from '../../models/object-model';
import { BaseService } from '../../services/base.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Column } from '../../models/shared-models';
import { TableTemplateComponent } from "../../components/table-template/table-template.component";

@Component({
    selector: 'app-objects-list',
    standalone: true,
    templateUrl: './objects-list.component.html',
    styleUrl: './objects-list.component.css',
    imports: [
        TableModule,
        CommonModule,
        ButtonModule,
        PaginatorModule,
        DialogModule,
        InputTextModule,
        FormsModule,
        CalendarModule,
        InputTextareaModule,
        TableTemplateComponent
    ]
})

export class ObjectsListComponent {
  objects!: ObjectModel[];
  visible: boolean = false;
  newObject: ObjectModel = new ObjectModel();

  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.baseService.getAllObjects().subscribe(data => {
        this.objects = data;
    });
  }

  deleteObject(id: number): void {
    this.baseService.delObject(id).subscribe(() => {
      this.baseService.getAllObjects().subscribe(data => this.objects = data);
    });
  }

  showDialog() {
    this.newObject = new ObjectModel();
    this.visible = true;
  }

  onSaveClick(){
    console.log(this.newObject);
    this.baseService.addNewObject(this.newObject).subscribe(() => {
      this.baseService.getAllObjects().subscribe(data => this.objects = data);
    });
    this.visible = false;
  }
}
