import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  imagePath = '../assets/loginpageimage.jpg';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      checkbox: new FormControl(false, [Validators.required]),
    });
  }

  login() {
    let storedData = localStorage.getItem('registerData');
    let existingUsers = storedData ? JSON.parse(storedData) : [];
    let enteredUsername = this.loginForm.value.username;
    let enteredPassword = this.loginForm.value.password;
    let foundUser = existingUsers.username === enteredUsername;

    if (!foundUser) {
      alert('User not found');
    } else if (existingUsers.password !== enteredPassword) {
      alert('Incorrect password');
    } else {
      alert('Login successful!');
      this.router.navigate(['/dashboard'])
    }
  }
}
