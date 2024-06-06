import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestModel } from '../../models/request-model';
import { ObjectModel } from '../../models/object-model';
import { BaseService } from '../../services/base.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Router, RouterLink } from '@angular/router';
import { ObjectsListComponent } from '../../manager/objects-list/objects-list.component';
import { TableTemplateComponent } from "../../components/table-template/table-template.component";
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    RouterLink,
    ObjectsListComponent,
    TableTemplateComponent,
    CardModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextareaModule,
  ]
})

export class SubmitRequestComponent implements OnInit{
  objects: ObjectModel[] = [];
  object: ObjectModel = new ObjectModel();
  status!: string;
  requestLink!: string;
  request: RequestModel = new RequestModel();
  isTableVisible: boolean = false;

  requestForm = this.fb.group({
    title: ['', Validators.required],
    description : ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    objectId: ['', Validators.required]
  })

  constructor(
    private baseService: BaseService,
    private router: Router,
    private fb:FormBuilder,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.baseService.getAllObjects().subscribe(data => {
      this.objects = data;
    });
  }

  submitRequest() {
    if(this.requestForm.valid){
      const postData = {
        ...this.requestForm.value,
        submissionDate: new Date(),
        status: 'Pending'
      };
      console.log(postData);

      this.baseService.submitRequest(postData as RequestModel).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Submission successfully' });
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      )
    }
  }


  selectedObject(obj: ObjectModel): void {
    this.object = { ...obj };
    this.requestForm.patchValue({ objectId: obj.id });
    this.isTableVisible = !this.isTableVisible;
  }

  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

  get title (){
    return this.requestForm.controls['title']
  }
  get description (){
    return this.requestForm.controls['description']
  }
  get email (){
    return this.requestForm.controls['email']
  }
}
