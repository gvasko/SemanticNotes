import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, catchError, throwError } from 'rxjs';
import { NoteSimilarityResult } from '../../model/note-similarity-result';
import { SimilarityMatrix } from '../../model/similarity-matrix';

@Injectable({
  providedIn: 'root'
})
export class SimilarityApiService {
  private baseUrl: string = "/api/similarity";
  constructor(protected http: HttpClient) { }

  getSimilarNotes(collectionId: number, noteId: number): Observable<NoteSimilarityResult> {
    return this.http.get<NoteSimilarityResult>(`${this.baseUrl}/${collectionId}/${noteId}`).pipe(take(1), catchError(this.handleError));
  }

  getSimilarityMatrix(noteCollectionId: number): Observable<SimilarityMatrix> {
    return this.http.get<SimilarityMatrix>(`${this.baseUrl}/matrix/${noteCollectionId}`).pipe(take(1), catchError(this.handleError));
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
