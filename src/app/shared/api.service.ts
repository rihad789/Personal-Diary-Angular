import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

   //url:string="http://localhost:8000/api/";

  url: string = "https://diary1147.herokuapp.com/api/";

  constructor(private _http: HttpClient) { }

  //Now We are going to use POST,GET,PUT,DELETE

  //Search Produycts Data
  searchDiary(data: any) {
    return this._http.post<any>(this.url + "diary/search", data).pipe(map((res: any) => {
      return res;
    }))
  }

  //Create Diary using Post method ->postDiary()
  postDiary(data: any) {
    return this._http.post<any>(this.url + "diary", data).pipe(map((res: any) => {
      return res;
    }))
  }

  //Get Diary Data
  getDiary(data: any) {
    return this._http.post<any>(this.url + "diary/getAllData", data).pipe(map((res: any) => {
      console.log(res);
      return res;
    }))
  }

  //Update Diary
  updateDiary(data: any) {
    return this._http.post<any>(this.url + "diary/update", data).pipe(map((res: any) => {
      return res;
    }))
  }

  //Delete Diary
  deleteDiary(id: number) {
    return this._http.get<any>(this.url + "diary/delete/" + id).pipe(map((res: any) => {
      return res;
    }))
  }


}
