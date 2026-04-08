// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { StudentService } from '../../services/student';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-marks-entry',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './marks-entry.html'
// })
// export class MarksEntry implements OnInit {

//   students: any[] = [];
//   selectedStudent: any = null;
//   marks: number | null = null;

//   constructor(private service: StudentService) {}

//   ngOnInit() {
//     this.students = this.service.getStudents();
//   }

//   saveMarks() {

//     // ✅ Validation
//     if (!this.selectedStudent || this.marks === null) {
//       alert('Please select student and enter marks');
//       return;
//     }

//     this.service.saveMarks({
//       name: this.selectedStudent.name,
//       section: this.selectedStudent.section,
//       class: this.selectedStudent.class,
//       division: this.selectedStudent.division,
//       marks: this.marks
//     });

//     alert('Marks Saved');

//     // 🔥 Reset fields properly
//     this.selectedStudent = null;
//     this.marks = null;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marks-entry',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './marks-entry.html'
})
export class MarksEntry implements OnInit {

  sections: string[] = [];
  classes: number[] = [];
  divisions: string[] = [];

  selectedSection = '';
  selectedClass: any = '';
  selectedDivision = '';

  allStudents: any[] = [];
  filteredStudents: any[] = [];

  constructor(private service: StudentService) {}

  ngOnInit() {
    this.sections = this.service.getSections();
    this.divisions = this.service.getDivisions();
    this.allStudents = this.service.getStudents();
  }

  // 🔥 Section change → update classes
  onSectionChange() {
    this.classes = this.service.getClassesBySection(this.selectedSection);
    this.selectedClass = '';
    this.selectedDivision = '';
    this.filteredStudents = [];
  }

  // 🔥 Filter students in real time
  // filterStudents() {

  //   this.filteredStudents = this.allStudents
  //     .filter(s =>
  //       (!this.selectedSection || s.section === this.selectedSection) &&
  //       (!this.selectedClass || s.class == this.selectedClass) &&
  //       (!this.selectedDivision || s.division === this.selectedDivision)
  //     )
  //     .map(s => ({
  //       ...s,
  //       marks: '' // 🔥 add input field per student
  //     }));
  // }

  filterStudents() {

  const marksData = this.service.getMarks(); // 🔥 get saved marks

  this.filteredStudents = this.allStudents
    .filter(s =>
      (!this.selectedSection || s.section === this.selectedSection) &&
      (!this.selectedClass || s.class == this.selectedClass) &&
      (!this.selectedDivision || s.division === this.selectedDivision)
    )
    .map(s => {

      // 🔥 find existing mark
      const existingMark = marksData.find((m: any) =>
        m.name === s.name &&
        m.class == s.class &&
        m.division === s.division &&
        m.section === s.section
      );

      return {
        ...s,
        marks: '', // input field
        enteredMark: existingMark ? existingMark.marks : null // 🔥 important
      };
    });
}

  // 🔥 Save marks for one student
  saveMarks(student: any) {

  if (!student.marks) {
    alert('Enter marks');
    return;
  }

  let marksData = this.service.getMarks();

  // 🔥 check if already exists
  const index = marksData.findIndex((m: any) =>
    m.name === student.name &&
    m.class == student.class &&
    m.division === student.division &&
    m.section === student.section
  );

  if (index !== -1) {
    // 🔁 UPDATE
    marksData[index].marks = student.marks;
  } else {
    // ➕ ADD NEW
    marksData.push({
      name: student.name,
      section: student.section,
      class: student.class,
      division: student.division,
      marks: student.marks
    });
  }

  // 🔥 Save back to localStorage
  localStorage.setItem('marks', JSON.stringify(marksData));

  alert(`Marks saved for ${student.name}`);

  // ✅ Update UI instantly
  student.enteredMark = student.marks;
  student.marks = '';
}
}