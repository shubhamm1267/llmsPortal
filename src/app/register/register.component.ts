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

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup | any;
  imagePath = 'src/app/assets/loginpageimage.jpg';

  constructor(private router: Router) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmpass: new FormControl('', [Validators.required]),
      checkbox: new FormControl(false, [Validators.required]),
    });
  }

  register() {
    let storedData = localStorage.getItem('registerData');
    let existingUsers = storedData ? JSON.parse(storedData) : [];
    console.log(existingUsers.username);
    let isUserExists =
      existingUsers.username === this.registerForm.value.username;

    if (isUserExists) {
      alert('Username already exists');
    } else {
      localStorage.setItem('registerData', JSON.stringify(existingUsers));
      alert('Registration successful!');
      this.router.navigate(['/login']);
    }
  }
}
