import { ObjectService } from './../../services/object.service';
import { RequestService } from './../../services/request.service';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { RequestModel } from '../../models/request-model';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Column } from '../../models/shared-models';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { forkJoin, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.scss',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    PaginatorModule,
    FormsModule,
    DropdownModule,
    CustomDatePipe,
  ],
})
export class RequestsListComponent implements OnInit {
  requests: RequestModel[]=[];
  statusOptions: { label: string; value: string }[];

  cols: Column[] = [
    { field: 'title', header: 'title' },
    { field: 'description', header: 'description' },
    { field: 'submissionDate', header: 'submissionDate' },
    { field: 'objectId', header: 'targetObject' },
  ];

  constructor(
    private requestService: RequestService,
    private objectService: ObjectService
  ) {
    this.statusOptions = [
      { label: 'Pending', value: 'Pending' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Completed', value: 'Completed' },
    ];
  }

  ngOnInit() {
    this.requestService
      .getAllRequests()
      .pipe(
        mergeMap((requests) => {
          const objectIds = Array.from(
            new Set(requests.map((req) => req.objectId))
          ); // уникальные objectId
          const objectRequests = objectIds.map((id) =>
            this.objectService
              .findObjectById(id)
              .pipe(map((object) => ({ id, name: object.name })))
          );
          return forkJoin(objectRequests).pipe(
            map((objects) => {
              const objectMap = new Map(
                objects.map((obj) => [obj.id, obj.name])
              );
              return requests.map((request) => ({
                ...request,
                objectId: objectMap.get(request.objectId) || request.objectId,
              }));
            })
          );
        })
      )
      .subscribe((updatedRequests) => {
        this.requests = updatedRequests;
      });
  }

  onDropdownChange(request: RequestModel) {
    this.requestService.updateRequest(request.id, request).subscribe(
      (response) => {
        console.log('Status updated successfully', response);
      },
      (error) => {
        console.error('Error updating status', error);
      }
    );
  }
}
