// import { Component, OnInit } from '@angular/core';

// import Chart from 'chart.js/auto';
// import { StudentService } from '../../services/student';

// @Component({
//   selector: 'app-graph',
//   standalone: true,
//   template: `<canvas id="chart"></canvas>`
// })
// export class Graph implements OnInit {

//   constructor(private service: StudentService) {}

//   ngOnInit() {
//     const marksData = this.service.getMarks();

//     const labels = marksData.map((m: any) => m.name);
//     const data = marksData.map((m: any) => m.marks);

//     new Chart('chart', {
//       type: 'bar',
//       data: {
//         labels: labels,
//         datasets: [{
//           label: 'Student Marks',
//           data: data
//         }]
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { StudentService } from '../../services/student';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './graph.html'
})
export class Graph implements OnInit {

  // ✅ Get from service (NO hardcoding)
  sections: string[] = [];
  classes: number[] = [];
  divisions: string[] = [];

  selectedSection = '';
  selectedClass: any = '';
  selectedDivision = '';

  chart: any;

  constructor(private service: StudentService) {}

  // ✅ Load dropdown values on init
  ngOnInit() {
  this.sections = this.service.getSections();
  this.divisions = this.service.getDivisions();
}

  onSectionChange() {
  this.classes = this.service.getClassesBySection(this.selectedSection);

  // 🔁 Reset selected class when section changes
  this.selectedClass = '';
}

  loadChart() {

    const marksData = this.service.getMarks();

    // 🔥 Multi-filter logic
    const filtered = marksData.filter((m: any) =>
      (!this.selectedSection || m.section === this.selectedSection) &&
      (!this.selectedClass || m.class == this.selectedClass) &&
      (!this.selectedDivision || m.division === this.selectedDivision)
    );

    // ⚠️ Handle empty data
    if (filtered.length === 0) {
      alert('No data found for selected filters');
      if (this.chart) {
        this.chart.destroy();
      }
      return;
    }

    const labels = filtered.map((m: any) => m.name);
    const data = filtered.map((m: any) => m.marks);

    // ❗ Destroy old chart
    if (this.chart) {
      this.chart.destroy();
    }

    // 📊 Create chart
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `Marks (${this.selectedSection || 'All'} - ${this.selectedClass || 'All'} - ${this.selectedDivision || 'All'})`,
          data: data
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

}