import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ObjectModel } from '../../models/object-model';
import { BaseService } from '../../services/base.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableTemplateComponent } from "../../components/table-template/table-template.component";
import { CardModule } from 'primeng/card';

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
      TableTemplateComponent,
      ReactiveFormsModule,
      CardModule,
    ]
})

export class ObjectsListComponent {
  objects!: ObjectModel[];
  addDialogvisible: boolean = false;
  editDialogVisible: boolean = false;
  editingObject: ObjectModel = new ObjectModel();
  showValidationErrors: boolean = false;

  addForm = this.fb.group({
    name: ['', [Validators.required]],
    registrationDate: [new Date()],
    address: [''],
    requestsCount:[0]
  });

  constructor(private baseService: BaseService, private fb: FormBuilder) {}

  ngOnInit() {
    this.baseService.getAllObjects().subscribe(data => {
        this.objects = data;
    });
  }

  get objectName() {
    return this.addForm.controls['name'];
  }

  editObject(id: string): void {
    this.baseService.findObjectById(id).subscribe((object: ObjectModel) =>{
      this.editingObject = object;
      this.editingObject.registrationDate = new Date(this.editingObject.registrationDate);
      this.editDialogVisible = true;
    });
  }

  deleteObject(id: string): void {
    this.baseService.delObject(id).subscribe(() => {
      this.baseService.getAllObjects().subscribe(data => this.objects = data);
    });
  }

  showAddDialog() {
    this.editingObject = new ObjectModel();
    this.addDialogvisible = true;
  }

  addNewObject(){
    if (this.addForm.valid) {
      const postData = { ...this.addForm.value, requestsCount:0 };
      this.baseService.addNewObject(postData as ObjectModel).subscribe(
        response => {
          this.baseService.getAllObjects().subscribe(data => this.objects = data);
          this.addDialogvisible = false;
        }
      )
    }
  }

  onSaveChangesClick() {
    this.showValidationErrors = true;
    if (!this.editingObject.name || !this.editingObject.registrationDate || !this.editingObject.address) {
      return;
    }

    let id = this.editingObject.id;
    this.baseService.updateObject(id, this.editingObject).subscribe(updatedObject => {
      this.baseService.getAllObjects().subscribe(data => this.objects = data);
      console.log("Object updated successfully", updatedObject);
      this.editDialogVisible = false;
    }, error => {
      console.error("Error updating object", error);
    });
  }
}
