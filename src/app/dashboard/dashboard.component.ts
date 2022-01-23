import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { Subject } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { Diary } from './diary.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  diaryModelObject: Diary = new Diary;
  allDiaryData: any;
  showAdd: boolean = false;
  showUpdate: boolean = false;
  showReset: boolean = false;
  id: any;
  userID: any;

  formValue: FormGroup = new FormGroup({ title: new FormControl(''), diary: new FormControl('') });
  showValue!: FormGroup;

  submitted = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private api: ApiService, private authService: AuthService) { }

  ngOnInit(): void {

    // this.id = localStorage.getItem('token');
    this.userID = localStorage.getItem('userID');

    //Addding validator for fields
    this.formValue = this.formBuilder.group({ title: ['', [Validators.required]], diary: ['', [Validators.required, Validators.maxLength(10000)]] });
    this.showValue = this.formBuilder.group({ title: [''], diary: [''] });

    this.getAllData();

  }

  get f(): { [key: string]: AbstractControl } {
    return this.formValue.controls;
  }

  //Now subscribing our form data
  clickAddDiary() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
    this.showReset = true;
  }

  //Get All Data
  getAllData() {
    this.diaryModelObject.userID = this.userID;
    this.api.getDiary(this.diaryModelObject).subscribe(res => {
      this.allDiaryData = res;
    })
  }

  //Add New Diary Record
  addDiary() {

    this.submitted = true;

    if (this.formValue.invalid) {
      return;
    }
    else {

      this.diaryModelObject.title = this.formValue.value.title;
      this.diaryModelObject.diary = this.formValue.value.diary;
      this.diaryModelObject.userID = this.userID;

      this.api.postDiary(this.diaryModelObject).subscribe(res => {

        if (res['status'] == true) {
          alert("New Diary Recorded succesfully");
          //clear Fill formd data 
          this.formValue.reset();
          this.getAllData();
          this.submitted = false;
        }
        else {
          alert(res['message']);
        }
      },
        err => {
          alert("Something is wrong");
        })
    }

    this.submitted = false
  }

  //View DIary Data
  viewDiary(data: any) {
    this.showValue.controls['title'].setValue(data.title);
    this.showValue.controls['diary'].setValue(data.diary);
  }

  //Setting value to modal on Edit click
  onEditDiary(data: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.showReset = true;
    this.diaryModelObject.id = data.id;
    this.formValue.controls['title'].setValue(data.title);
    this.formValue.controls['diary'].setValue(data.diary);
  }

  //Update diary value to database
  updateDiary() {

    this.submitted = true;
    if (this.formValue.invalid) {
      return;
    }
    else {
      this.diaryModelObject.title = this.formValue.value.title;
      this.diaryModelObject.diary = this.formValue.value.diary;

      this.api.updateDiary(this.diaryModelObject).subscribe(res => {
        if (res['status'] == true) {
          alert("Diary data Updated SUcessfully");
          this.getAllData();
        }
        else {
          alert(res['message']);
        }
      },
        err => {
          alert("Something is wrong");
        })
    }
  }

  //Delete Diary Records
  deleteDiary(data: any) {

    if (confirm("Would you like to delete this diary?")) {
      this.api.deleteDiary(data.id).subscribe(res => {
        console.log(data.id)
        if (res['status'] == true) {
          alert("Records Deleted successfully");
          this.getAllData();
          //clear Fill formd data 
          this.formValue.reset();
        }
        else {
          alert(res['message']);
        }
      },
        err => { alert("Something is wrong"); }
      )
    }
  }

  searchDiary(input: any) {

    this.diaryModelObject.userID = this.userID;
    this.diaryModelObject.searchKey = input;

    this.api.searchDiary(this.diaryModelObject).subscribe((res: any) => {
      this.allDiaryData = res;
    })

  }

  //Reset Form
  resetForm() {
    this.submitted = false;
    this.formValue.reset();
  }

  //Logout
  logout() {
    console.log('logout');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
