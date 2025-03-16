import { Injectable } from '@angular/core';
import { UserInfo } from '../../model/user-info';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseApiService<UserInfo> {

  constructor(http: HttpClient) {
    super(http, "/api/user");
  }
}
