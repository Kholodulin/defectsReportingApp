import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  templateUrl: './custom-paginator.component.html',
  styleUrl: './custom-paginator.component.scss',
  imports: [DropdownModule, FormsModule, ButtonModule, CommonModule],
})
export class CustomPaginatorComponent<T> implements OnChanges {
  @Input() data: T[] = [];
  @Output() dataForShow = new EventEmitter<T[]>();

  selectedRowsCount: number = 5;
  rowsPerPageList: { label: number; value: number }[];

  currentPage: number = 0;
  totalPages: number = 0;

  constructor() {
    this.rowsPerPageList = [
      { label: 5, value: 5 },
      { label: 10, value: 10 },
      { label: 15, value: 15 },
    ];
  }
  ngOnChanges(): void {
    setTimeout(() => {
      this.totalPages = Math.ceil(this.data.length / this.selectedRowsCount);
      console.log('totalPages', this.totalPages);
      this.emitDataForShow();
    }, 50);
  }

  emitDataForShow() {
    const start = this.currentPage * this.selectedRowsCount;
    const end = start + this.selectedRowsCount;
    this.dataForShow.emit(this.data.slice(start, end));
  }

  onDoubleLeft() {
    this.currentPage = 0;
    this.emitDataForShow();
  }

  onLeft() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.emitDataForShow();
    }
  }

  onRight() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.emitDataForShow();
    }
  }

  onDoubleRight() {
    this.currentPage = this.totalPages - 1;
    this.emitDataForShow();
  }

  onRowsCountChanged() {
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.data.length / this.selectedRowsCount);
    this.emitDataForShow();
  }

  getPagesArray(): number[] {
    const totalPagesArray = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
    if (this.totalPages <= 5) {
      return totalPagesArray;
    }

    if (this.currentPage < 3) {
      return totalPagesArray.slice(0, 5);
    } else if (this.currentPage > this.totalPages - 3) {
      return totalPagesArray.slice(this.totalPages - 5, this.totalPages);
    } else {
      return totalPagesArray.slice(this.currentPage - 2, this.currentPage + 3);
    }
  }

  goToPage(page: number) {
    this.currentPage = page - 1;
    this.emitDataForShow();
  }
}
