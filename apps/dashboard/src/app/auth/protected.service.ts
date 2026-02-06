import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProtectedService {
  private http = inject(HttpClient);

  getProtected() {
    return this.http.get<{ message: string }>('/api/protected');
  }
}
