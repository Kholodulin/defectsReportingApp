import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RequestModel } from '../../models/request-model';
import { ObjectModel } from '../../models/object-model';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Router, RouterLink } from '@angular/router';
import { ObjectsListComponent } from '../../manager/objects-list/objects-list.component';
import { TableTemplateComponent } from '../../components/table-template/table-template.component';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FileUploadService } from '../../services/file-upload.service';
import { v4 as uuidv4 } from 'uuid';
import { RequestService } from '../../services/request.service';
import { ObjectService } from './../../services/object.service';

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
  ],
})
export class SubmitRequestComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  objects: ObjectModel[] = [];
  object: ObjectModel = new ObjectModel();
  requestLink!: string;
  isTableVisible: boolean = false;
  selectedFiles: File[] = [];

  requestForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    objectId: ['', Validators.required],
  });

  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit() {
    this.objectService.getAllObjects().subscribe((data) => {
      this.objects = data;
    });
  }

  get title() {
    return this.requestForm.controls['title'];
  }
  get description() {
    return this.requestForm.controls['description'];
  }
  get email() {
    return this.requestForm.controls['email'];
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    console.log('selectedFiles', this.selectedFiles);
  }

  submitRequest() {
    if (this.requestForm.valid) {
      const uniqueId = this.selectedFiles.length > 0 ? uuidv4() : null;
      const postData = {
        ...this.requestForm.value,
        submissionDate: new Date(),
        status: 'Pending',
        attachedFilesId: uniqueId,
      };
      this.requestService.submitRequest(postData as RequestModel).subscribe(
        (response) => {
          if (uniqueId) {
            this.fileUploadService
              .uploadFiles(this.selectedFiles, uniqueId)
              .subscribe(
                (response) => {
                  console.log('Form and files submitted successfully');
                  this.selectedFiles.length = 0;
                },
                (error) => {
                  console.log('uploadFiles error', error);
                  this.messageService.add({
                    severity: 'warning',
                    detail: 'Unable to upload files',
                  });
                }
              );
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Form submitted successfully',
          });
          this.clearForm();
          this.requestLink = this.router
            .createUrlTree(['/request-status', response.id])
            .toString();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
          });
        }
      );
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

  clearForm() {
    this.requestForm.reset();
    this.requestForm.patchValue({ objectId: null });
    this.object = new ObjectModel();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
