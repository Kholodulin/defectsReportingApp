import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestModel } from '../../models/request-model';
import { ObjectModel } from '../../models/object-model';
import { BaseService } from '../../services/base.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Router, RouterLink } from '@angular/router';
import { ObjectsListComponent } from '../../manager/objects-list/objects-list.component';
import { TableTemplateComponent } from "../../components/table-template/table-template.component";

@Component({
    selector: 'app-submit-request',
    standalone: true,
    templateUrl: './submit-request.component.html',
    styleUrl: './submit-request.component.css',
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        FloatLabelModule,
        InputTextareaModule,
        RouterLink,
        ObjectsListComponent,
        TableTemplateComponent
    ]
})


export class SubmitRequestComponent implements OnInit{
  objects: ObjectModel[] = [];
  object!: ObjectModel;
  status!: string;
  requestLink!: string;
  request: RequestModel = new RequestModel();

  constructor(private baseService: BaseService, private router: Router) {}

  ngOnInit() {
    this.baseService.getAllObjects().subscribe(data => {
      this.objects = data;
    });
  }

  submitRequest() {
    const requestload: RequestModel = {
      ...this.request,
      objectId: this.request.objectId
    };

    this.baseService.submitRequest(requestload).subscribe(response => {
      this.requestLink = this.router.createUrlTree(['/request-status', response.id]).toString();
      console.log('Request submitted successfully', response);
    }, error => {
      console.error('Error submitting request', error);
    });
  }

  selectedObject(id: string): void {
    this.request.objectId = id;
  }
}
