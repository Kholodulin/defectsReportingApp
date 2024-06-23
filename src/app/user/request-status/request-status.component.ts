import { Component, OnInit } from '@angular/core';
import { RequestModel } from '../../models/request-model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-status.component.html',
  styleUrl: './request-status.component.scss',
})
export class RequestStatusComponent implements OnInit {
  request!: RequestModel;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.requestService.findRequestById(requestId).subscribe(
        (request: RequestModel) => {
          this.request = request;
        },
        (error) => {
          console.error('Error fetching request', error);
        }
      );
    } else {
      console.error('Invalid request ID');
    }
  }
}
