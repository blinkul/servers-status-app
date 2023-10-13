import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from '../interface/custom-response';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({ providedIn: 'root'})
export class ServerService {

  private readonly apiUrl = 'any';

  constructor(private http: HttpClient) { }

  //example for procedural approach
  // getServers(): Observable<CustomResponse> {
  //   return this.http.get<CustomResponse>(`http://localhost:8080/server/list`);
  // }

  //reactive approach
  server$ = <Observable<CustomResponse>> 
  this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$ = (server: Server) => <Observable<CustomResponse>> 
  this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  ping$ = (ipAddress: string) => <Observable<CustomResponse>> 
  this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>> 
  new Observable<CustomResponse> (
    //callback function
    subscriber => {
      console.log(response);
      //emit new value to the subscriber
      subscriber.next(
          status === Status.ALL ? 
              { ...response, message: `Servers filtered by ${status} status`} 
                : 
              //filter the servers
              { ...response, 
                //override message from CustomResponse
                message: response.data.servers.filter(server => server.status === status).length > 0 
                              ? 
                        `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status` 
                              : 
                        `No servers of ${status} found`,
                //override data object from CustomResponse
                data: { servers: response.data.servers.filter(server => server.status === status) }
              }
      );
      subscriber.complete();
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  delete$ = (serverId: number) => <Observable<CustomResponse>> 
  this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => `Am error occured - Error code: ${error.status}`);
  }
}
