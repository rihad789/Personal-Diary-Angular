import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  url: string = "https://diary1147.herokuapp.com/api/login";

  message: string = '';
  returnUrl: string = '';
  status: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  submitted = false;

  constructor(private formBuilder: FormBuilder, private _http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    //Checking login and Returnning Home URL 
    this.returnUrl = '/diary';
    if (localStorage.getItem('isLoggedIn') == "true") {
      this.router.navigate([this.returnUrl])
    }

    //Addding validator for fields
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(40)
          ]
        ]
      }
    );

    //this.authService.logout();

  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  checkLogin() {

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    else {

      this._http.post<any>(this.url, this.loginForm.value).subscribe(res => {

        if (res['status']) {
          alert(res['message']);

          console.log("Login successful");
          localStorage.setItem('isLoggedIn', "true");

          //localStorage.setItem('token', this.loginForm.value);

          localStorage.setItem('userID',this.loginForm.value.email)
          this.loginForm.reset();
          this.router.navigate([this.returnUrl])
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
    this.loginForm.reset();
  }
}
