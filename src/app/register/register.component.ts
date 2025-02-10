import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup | any;
  imagePath = 'src/app/assets/loginpageimage.jpg';
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmpass: new FormControl('', [Validators.required]),
      checkbox: new FormControl(false, [Validators.required]),
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.errorMessage =
        'Please fill in all required fields and accept the terms.';
      return;
    }

    if (
      this.registerForm.value.password !== this.registerForm.value.confirmpass
    ) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.userService.register(this.registerForm.value).subscribe(
      (res: any) => {
        if (res.success) {
          this.successMessage = res.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = res.message;
        }
      },
      (err) => {
        this.errorMessage = err.error.message || 'Registration failed.';
      }
    );
  }
}
