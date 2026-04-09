// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Student {
  
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  // 🔹 Dropdown Data
  getSections() {
    return ['LP', 'UP','lll'];
  }

  getClasses() {
    return [1, 2, 3,4,5,6,7];
  }

  getDivisions() {
    return ['A', 'B', 'C'];
  }

  getClassesBySection(section: string) {
  if (section === 'LP') {
    return [1, 2, 3, 4];
  } else if (section === 'UP') {
    return [5, 6, 7];
  }
  return []; // default
}



  // 🔹 Student Storage
  getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
  }

  addStudent(student: any) {
    const students = this.getStudents();
    students.push(student);
    
    localStorage.setItem('students', JSON.stringify(students));
  }

  // 🔹 Marks Storage
  saveMarks(mark: any) {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    marks.push(mark);
    localStorage.setItem('marks', JSON.stringify(marks));
  }

  getMarks() {
    // localStorage.removeItem('marks');
    return JSON.parse(localStorage.getItem('marks') || '[]');
  }
}