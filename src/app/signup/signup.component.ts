import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Diary } from '../dashboard/diary.model';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  url: string = "https://diary1147.herokuapp.com/api/signup";
  diaryModelObject: Diary = new Diary;
  signupForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    acceptTerms: new FormControl(false),
  });

  submitted = false;
  constructor(private formBuilder: FormBuilder, private _http: HttpClient, private router: Router) { }

  ngOnInit(): void {

    this.signupForm = this.formBuilder.group(
      {
        name: ['',[Validators.required,Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(40)]],
        acceptTerms: [false, Validators.requiredTrue]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  //Making signup method

  signUp() {

    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }
    else
    {
      this._http.post<any>(this.url, this.signupForm.value).subscribe(res => {

        if (res['status']) {
          alert(res['message']);
          this.signupForm.reset();
          this.router.navigate(['login']);
        }
        else {
          alert(res['message']);
        }

      }, err => {
        alert('Something went wrong');
      })
    }

  }


  onReset(): void {
    this.submitted = false;
    this.signupForm.reset();
  }

}
