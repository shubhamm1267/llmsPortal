import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  sidebarOpen = true;
  tabIndex = 0;
  userList: any[] = [];
  studentList: any[] = [];
  
  showToast = false;
  selectedUser: any = null;

  filteredUserList: any = [...this.userList];
  filteredStudentList: any = [...this.studentList];

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
  currentPage = 1;
  itemsPerPage = 8;
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users) => (this.studentList = users));
    console.log('users========>>>>>>>>>>>', this.studentList);
  }

  addUser() {
    this.userService.addUser(this.studentForm.value).subscribe(() => {
      this.showNotification();
      this.loadUsers();
    });
  }

  updateUser() {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser._id, this.studentForm.value).subscribe(() => {
        this.showNotification();
        this.loadUsers();
      });
    }
  }


  showNotification() {
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  setTabIndex(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  get totalPages(): number {
    return Math.ceil(this.studentList.length / this.itemsPerPage);
  }

  get paginatedList() {
    let start = (this.currentPage - 1) * this.itemsPerPage;
    return this.studentList.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('registerData');
  }

  openModal(index: any | null = null) {
    this.isEdit = index !== null;
    this.selectedIndex = index;

    if (this.isEdit) {
      this.userForm.setValue(this.filteredUserList[index]);
    } else {
      this.userForm.reset({ status: 'Select Status', role: 'Select Role' });
    }

    this.isModalOpen = true;
  }

  openStudentModal(index: any | null = null) {
    this.isEdit = index !== null;
    this.selectedIndex = index;

    if (this.isEdit) {
      this.studentForm.setValue(this.filteredStudentList[index]);
    } else {
      this.studentForm.reset({ status: 'Select Status' });
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  filterUsers() {
    const text = this.searchText.toLowerCase();
    this.filteredUserList = this.userList.filter(
      (user) =>
        user.id.toLowerCase().includes(text) ||
        user.fname.toLowerCase().includes(text) ||
        user.username.toLowerCase().includes(text) ||
        user.role.toLowerCase().includes(text) ||
        user.status.toLowerCase().includes(text)
    );
  }

  filterStudents() {
    const text = this.searchText.toLowerCase();
    this.filteredUserList = this.studentList.filter(
      (user) =>
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

  onStudentSubmit() {
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
  editStudent(user: any) {
    this.selectedUser = user;
    this.studentForm.patchValue(user);
  }
 

  deleteUser(index: number) {
    const originalIndex = this.userList.indexOf(this.filteredUserList[index]);
    this.userList.splice(originalIndex, 1);
    this.filterUsers();
  }

  deleteStudent(id: any) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    this.filterUsers();
  }
}
