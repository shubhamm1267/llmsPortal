import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import Swal from 'sweetalert2'
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
  userName: any;
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
          this.showSuccessToast(`Hi ${res.user.username} Welcome`)
          localStorage.setItem('user',res.user.username)
          
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message;
          this.showErrorToast(`Hi ${res.user.username + " " + this.errorMessage}`)
        }
      },
      (err:any) => {
        this.errorMessage = err.error.message || 'Login failed.';
        this.showWarnToast(this.errorMessage)

      }
    );
  }
  showSuccessToast(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
  showErrorToast(message: string) {
    Swal.fire({
      icon: 'error',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showWarnToast(message: string) {
    Swal.fire({
      icon: 'warning',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
}
