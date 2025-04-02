import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, catchError, throwError } from 'rxjs';
import { NoteSimilarityResult } from '../../model/note-similarity-result';

@Injectable({
  providedIn: 'root'
})
export class SimilarityApiService {
  private baseUrl: string = "/api/similarity";
  constructor(protected http: HttpClient) { }

  getSimilarNotes(id: number): Observable<NoteSimilarityResult> {
    return this.http.get<NoteSimilarityResult>(`${this.baseUrl}/${id}`).pipe(take(1), catchError(this.handleError));
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
