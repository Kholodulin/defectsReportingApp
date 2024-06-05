import { Component, OnInit } from '@angular/core';
import { RequestModel } from '../../models/request-model';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../../services/base.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-status.component.html',
  styleUrl: './request-status.component.css'
})
export class RequestStatusComponent implements OnInit{
  request!: RequestModel;

  constructor(private route: ActivatedRoute, private baseService: BaseService) {}

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.baseService.findRequestById(requestId).subscribe(
        (request: RequestModel) => {
          this.request = request;
        },
        error => {
          console.error('Error fetching request', error);
        }
      );
    } else {
      console.error('Invalid request ID');
    }
    console.log(requestId, this.request);
  }
}
