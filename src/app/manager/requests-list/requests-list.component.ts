import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../services/base.service';
import { RequestModel } from '../../models/request-model';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Column } from '../../models/shared-models';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [
    TableModule, CommonModule, ButtonModule, PaginatorModule, FormsModule, DropdownModule
  ],
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.css'
})


export class RequestsListComponent {
  requests!: RequestModel[];
  statusOptions!: { label: string, value: string }[];

  cols: Column[] = [
    { field: 'title', header: 'title' },
    { field: 'description', header: 'description' },
    { field: 'submissionDate', header: 'submissionDate' },
    { field: 'objectId', header: 'objectId' }
  ];

  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.baseService.getAllRequests().subscribe(data => {
        this.requests = data;
    });

    this.statusOptions = [
      { label: 'Pending', value: 'Pending' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Completed', value: 'Completed' }
    ];
  }

  onDropdownChange(event: any, request: RequestModel) {
    const newStatus = event.value;
    console.log(event, request);
    this.baseService.updateRequest(request.id, request).subscribe(
      response => {
        console.log('Status updated successfully', response);
      },
      error => {
        console.error('Error updating status', error);
      }
    );
  }
}
