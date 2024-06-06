import { Component } from '@angular/core';
import { FileUploadEvent, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    FileUploadModule,
    ToastModule,
    CommonModule
    ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService, private fileUploadService: FileUploadService) {}

  onUpload(event: FileUploadHandlerEvent) {
      const files: File[] = Array.from(event.files);
      this.fileUploadService.uploadFiles(files).subscribe(
          (responses) => {
              for (let file of files) {
                  this.uploadedFiles.push(file);
              }
              this.messageService.add({severity: 'info', summary: 'Files Uploaded', detail: ''});
          },
          (error) => {
              this.messageService.add({severity: 'error', summary: 'File Upload Failed', detail: 'An error occurred while uploading files.'});
              console.error('Error uploading files', error);
          }
      );
  }
}
