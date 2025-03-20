import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService<T> {
  constructor(protected http: HttpClient, private baseUrl: string) { }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl).pipe(take(1), catchError(this.handleError));
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`).pipe(take(1), catchError(this.handleError));
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, item).pipe(take(1), catchError(this.handleError));
  }

  update(item: T): Observable<T> {
    return this.http.put<T>(this.baseUrl, item).pipe(take(1), catchError(this.handleError));
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(take(1), catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
