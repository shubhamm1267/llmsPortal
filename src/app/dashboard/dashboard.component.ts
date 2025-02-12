import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

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
  totalUsers: number = 0;
  todayUsers: number = 0;
  filteredUserList: any = [...this.userList];
  filteredStudentList: any = [...this.studentList];
  fileName = 'ExcelSheet.xlsx';
  studentColumns: any = ["ID", "Licence", "Full Name", "Mobile", "Status", "Actions"];
  userColumns: any = ["ID", "Full Name", "Username", "Role", "Status", "Actions"];
  licenceColumns: any = ["ID", "Entity Name", "# of Licences", "Used", "Status", "Actions"];
  courseColumns: any = ["ID", "Course Name", "Certificate", "Configure", "Status", "Actions"];
  mastersColumns: any = ["ID", "Data Master", "Data Size", "Mobile", "Status", "Actions"];
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
  studentName:any;
  userName: any;
  currentColumns: any=0;
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
    this.userName = localStorage.getItem('user');
    this.userService.getUserCounts().subscribe(
      (res: any) => {
        if (res.success) {
          this.totalUsers = res.totalUsers;
          this.todayUsers = res.todayCount;
        }
      },
      (error) => {
        console.error("Error fetching user counts:", error);
      }
    );
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users) => (this.studentList = users));
    console.log('users========>>>>>>>>>>>', this.studentList);
  }

  addUser() {
    this.userService.addUser(this.studentForm.value).subscribe(() => {
      this.showNotification();
      this.showSuccessToast("User Added Sucessfully");
      this.loadUsers();
    });
  }

  
  updateUser() {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser._id, this.studentForm.value).subscribe(() => {
        this.showNotification();
        this.showSuccessToast("User Updated Sucessfully");
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
   this.loadUsers();
    if (tabIndex === 1) {
      this.currentColumns = this.userColumns;
    }

    else if (tabIndex === 2) {
      this.currentColumns = this.userColumns;
    }

    else if (tabIndex === 3) {
      this.currentColumns = this.studentColumns;
    }
    else if (tabIndex === 4) {
      this.currentColumns = this.licenceColumns;
    }
    else if (tabIndex === 5) {
      this.currentColumns = this.courseColumns;
    }
    else if (tabIndex === 6) {
      this.currentColumns = this.licenceColumns;
    }
    else if (tabIndex === 7) {
      this.currentColumns = this.mastersColumns;
    }
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

  logout() {
    this.router.navigate(['/login']);
    this.showSuccessToast("Logout Successfully");
    localStorage.clear();
  }

  exportexcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

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
    this.showSuccessToast("User Deleted Sucessfully");
    this.filterUsers();
  }
}
