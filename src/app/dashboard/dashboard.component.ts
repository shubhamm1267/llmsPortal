import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  sidebarOpen = true;
  tabIndex=0;
  userList:any[]= [
    {id:"CI17211",fname:"Sagar",username:"sagar@cloverinfoech.com",role:"Frontend",status:"Active"},
    {id:"CI17212",fname:"Shubham",username:"shubham@cloverinfoech.com",role:"Backend",status:"Inactive"},
    {id:"CI17213",fname:"Avesh",username:"avesh@cloverinfoech.com",role:"Backend",status:"Active"},
    {id:"CI17214",fname:"Aman",username:"aman@cloverinfoech.com",role:"Backend",status:"Inactive"},
    {id:"CI17215",fname:"Panu",username:"panu@cloverinfoech.com",role:"Backend",status:"Inactive"},
    {id:"CI17216",fname:"Harsh",username:"harsh@cloverinfoech.com",role:"Frontend",status:"Active"}
  ];
  studentList:any[]= [
    {id:"CI17211",licence:"Pune",fname:"sagar",mobile:8830267423,status:"Active"},
    {id:"CI17212",licence:"Mumbai",fname:"shubham",mobile:7830267423,status:"Inactive"},
    {id:"CI17213",licence:"Delhi",fname:"avesh",mobile:6768547439,status:"Active"},
    {id:"CI17214",licence:"Kolkata",fname:"aman",mobile:9412474697,status:"Inactive"},
    {id:"CI17215",licence:"Jalgaon",fname:"panu",mobile:9422308532,status:"Inactive"},
    {id:"CI17216",licence:"Pune",fname:"harsh",mobile:7712870733,status:"Active"}
  ];

  filteredUserList:any = [...this.userList];
  filteredStudentList:any = [...this.studentList];

  searchText = '';

  userForm = new FormGroup({
    id: new FormControl(''),
    fname: new FormControl(''),
    username: new FormControl(''),
    role: new FormControl('Select Role'),
    status: new FormControl('Select Status'),
  });
  studentForm = new FormGroup({
    id: new FormControl(''),
    licence: new FormControl(''),
    fname: new FormControl(''),
    mobile: new FormControl(''),
    status: new FormControl('Select Status'),
  });

  isEdit = false;
  selectedIndex: number | null = null;
  isModalOpen = false;
  constructor(private router: Router) {}


  ngOnInit() {
  
  }

  setTabIndex(tabIndex:number){
    this.tabIndex = tabIndex;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(){
   this.router.navigate(['/login'])
   localStorage.removeItem("registerData");
  }

  openModal(index: any | null = null) {
    this.isEdit = index !== null;
    this.selectedIndex = index;

    if (this.isEdit) {
      this.userForm.setValue(this.filteredUserList[index]);
    } else {
      this.userForm.reset({ status: 'Select Status',role:'Select Role' });
    }

    this.isModalOpen = true;
  }

  openStudentModal(index: any | null = null) {
    this.isEdit = index !== null;
    this.selectedIndex = index;

    if (this.isEdit) {
      this.studentForm.setValue(this.filteredStudentList[index]);
    } else {
      this.studentForm.reset({ status: 'Select Status'});
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  filterUsers() {
    const text = this.searchText.toLowerCase();
    this.filteredUserList = this.userList.filter(user =>
      user.id.toLowerCase().includes(text) ||
      user.fname.toLowerCase().includes(text) ||
      user.username.toLowerCase().includes(text) ||
      user.role.toLowerCase().includes(text) ||
      user.status.toLowerCase().includes(text)
    );
  }

  filterStudents(){
    const text = this.searchText.toLowerCase();
    this.filteredUserList = this.studentList.filter(user =>
      user.id.toLowerCase().includes(text) ||
      user.licence.toLowerCase().includes(text) ||
      user.fname.toLowerCase().includes(text) ||
      user.mobile.toLowerCase().includes(text) ||
      user.status.toLowerCase().includes(text)
    );
  }
  

  onSubmit() {
    if (this.isEdit && this.selectedIndex !== null) {
      this.userList[this.selectedIndex] = this.userForm.value;
    } else {
      this.userList.push(this.userForm.value);
    }
    this.filterUsers(); 
    this.closeModal();
  }

  onStudentSubmit(){
    if (this.isEdit && this.selectedIndex !== null) {
      this.studentList[this.selectedIndex] = this.studentForm.value;
    } else {
      this.studentList.push(this.studentForm.value);
    }
    this.filterStudents(); 
    this.closeModal();
  }

  editUser(index: number) {
    this.openModal(index);
  }

  editStudent(index: number) {
    this.openStudentModal(index);
  }

  deleteUser(index: number) {
    const originalIndex = this.userList.indexOf(this.filteredUserList[index]);
    this.userList.splice(originalIndex, 1);
    this.filterUsers();
  }

  deleteStudent(index: number) {
    const originalIndex = this.studentList.indexOf(this.filteredStudentList[index]);
    this.studentList.splice(originalIndex, 1);
    this.filterUsers();
  }
}
