import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ObjectModel } from '../../models/object-model';
import { BaseService } from '../../services/base.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableTemplateComponent } from "../../components/table-template/table-template.component";

@Component({
    selector: 'app-objects-list',
    standalone: true,
    templateUrl: './objects-list.component.html',
    styleUrl: './objects-list.component.css',
    imports: [
        CommonModule,
        ButtonModule,
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
  addDialogvisible: boolean = false;
  editDialogvisible: boolean = false;
  editingObject: ObjectModel = new ObjectModel();

  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.baseService.getAllObjects().subscribe(data => {
        this.objects = data;
    });
  }

  editObject(id: number): void {
    this.baseService.findObjectById(id).subscribe((object: ObjectModel) =>{
      this.editingObject = object;
    });
    this.editDialogvisible = true;
  }

  deleteObject(id: number): void {
    this.baseService.delObject(id).subscribe(() => {
      this.baseService.getAllObjects().subscribe(data => this.objects = data);
    });
  }

  showAddDialog() {
    this.editingObject = new ObjectModel();
    this.addDialogvisible = true;
  }

  onSaveNewObjectClick(){
    console.log(this.editingObject);
    this.baseService.addNewObject(this.editingObject).subscribe(() => {
      this.baseService.getAllObjects().subscribe(data => this.objects = data);
    });
    this.addDialogvisible = false;
  }
  onSaveChangesClick() {
    let id = this.editingObject.id;
    this.baseService.updateObject(id, this.editingObject).subscribe(updatedObject => {
      this.baseService.getAllObjects().subscribe(data => this.objects = data);
      console.log("Object updated successfully", updatedObject);
      this.editDialogvisible = false;
    }, error => {
      console.error("Error updating object", error);
    });
  }
}
