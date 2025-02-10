import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  imagePath = '../assets/loginpageimage.jpg';
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private router: Router,private userService:UserService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      checkbox: new FormControl(false, [Validators.required]),
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields and accept the terms.';
      return;
    }

    this.userService.login(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.success) {
          this.successMessage = res.message;
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message;
        }
      },
      (err:any) => {
        this.errorMessage = err.error.message || 'Login failed.';
      }
    );
  }
}
