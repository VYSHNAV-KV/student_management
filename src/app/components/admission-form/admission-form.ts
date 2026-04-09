import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admission-form.html',
  styleUrl: './admission-form.css'
})
export class AdmissionForm implements OnInit {

  student = {
    name: '',
    section: '',
    class: '',
    division: ''
  };

  sections: string[] = [];
  classes: number[] = []; // ⚠️ will change dynamically
  divisions: string[] = [];

  constructor(private service: StudentService) {}

  ngOnInit() {
    this.sections = this.service.getSections();
    this.divisions = this.service.getDivisions();
  }

  // 🔥 IMPORTANT: Dynamic class update
  onSectionChange() {
    this.classes = this.service.getClassesBySection(this.student.section);

    // 🔁 Reset class when section changes
    this.student.class = '';
  }

  addStudent() {
    this.service.addStudent(this.student);
    alert('Student Added');

    this.student = { name: '', section: '', class: '', division: '' };
    this.classes = []; // reset class dropdown
  }
}