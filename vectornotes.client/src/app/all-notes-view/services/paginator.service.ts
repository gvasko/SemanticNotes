import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private _pageSize: number = 10;
  private _pageSizeOptions: number[] = [10, 20, 50];
  private _pageIndex: number = 0;

  constructor() { }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(s: number) {
    this._pageSize = s;
  }

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  set pageIndex(i: number) {
    this._pageIndex = i;
  }



}
