import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marks-entry',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './marks-entry.html',
  styleUrl: './marks-entry.css'
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

  // 🔥 FILTER STUDENTS
  filterStudents() {

    const marksData = this.service.getMarks();

    this.filteredStudents = this.allStudents
      .filter(s =>
        (!this.selectedSection || s.section === this.selectedSection) &&
        (!this.selectedClass || s.class == this.selectedClass) &&
        (!this.selectedDivision || s.division === this.selectedDivision)
      )
      .map(s => {

        const existingMark = marksData.find((m: any) =>
          m.name === s.name &&
          m.class == s.class &&
          m.division === s.division &&
          m.section === s.section
        );

        return {
          ...s,
          marks: '',
          enteredMark: existingMark ? existingMark.marks : null,

          // store original (for update)
          originalName: s.name,
          originalClass: s.class,
          originalDivision: s.division,
          originalSection: s.section
        };
      });
  }

  getClasses(section: string) {
  return this.service.getClassesBySection(section);
}

  // 🔥 SINGLE SAVE FUNCTION
  saveAll(student: any) {

  // ===== UPDATE STUDENT =====
  let students = this.service.getStudents();

  const index = students.findIndex((s: any) =>
    s.name === student.originalName &&
    s.class == student.originalClass &&
    s.division === student.originalDivision &&
    s.section === student.originalSection
  );

  if (index !== -1) {
    students[index] = {
      name: student.name,
      section: student.section,
      class: student.class,
      division: student.division
    };
  }
  // localStorage.removeItem('marks')
  localStorage.setItem('students', JSON.stringify(students));

  // ===== UPDATE MARK =====
  let marksData = this.service.getMarks();

  const markIndex = marksData.findIndex((m: any) =>
    m.name === student.originalName &&
    m.class == student.originalClass &&
    m.division === student.originalDivision &&
    m.section === student.originalSection
  );

  if (markIndex !== -1) {
    marksData[markIndex] = {
      name: student.name,
      section: student.section,
      class: student.class,
      division: student.division,
      marks: student.marks ? student.marks : marksData[markIndex].marks
    };
  } else if (student.marks) {
    marksData.push({
      name: student.name,
      section: student.section,
      class: student.class,
      division: student.division,
      marks: student.marks
    });
  }

  localStorage.setItem('marks', JSON.stringify(marksData));

  // ===== UI UPDATE =====
  if (student.marks) {
    student.enteredMark = student.marks;
    student.marks = '';
  }

  // 🔥 VERY IMPORTANT (FIX YOUR BUG)
  student.originalName = student.name;
  student.originalClass = student.class;
  student.originalDivision = student.division;
  student.originalSection = student.section;

  // refresh
  this.allStudents = students;
  this.filterStudents();

  alert('Saved successfully');
}

  // 🔥 DELETE
  deleteStudent(student: any) {

  // remove student
  this.allStudents = this.allStudents.filter(s =>
    !(s.name === student.originalName &&
      s.class == student.originalClass &&
      s.division === student.originalDivision &&
      s.section === student.originalSection)
  );

  localStorage.setItem('students', JSON.stringify(this.allStudents));

  // 🔥 remove only that student's marks
  let marksData = this.service.getMarks();

  marksData = marksData.filter((m: any) =>
    !(m.name === student.originalName &&
      m.class == student.originalClass &&
      m.division === student.originalDivision &&
      m.section === student.originalSection)
  );

  localStorage.setItem('marks', JSON.stringify(marksData));

  this.filterStudents();

  alert('Student deleted');
}

}