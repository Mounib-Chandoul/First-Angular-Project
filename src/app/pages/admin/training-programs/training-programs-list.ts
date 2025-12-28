import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-training-programs-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './training-programs-list.html',
  styleUrl: './training-programs-list.css'
})
export class TrainingProgramsListComponent implements OnInit {
  programs: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPrograms();
  }

  loadPrograms() {
    this.loading = true;
    this.error = '';
    this.api.getTrainingPrograms().subscribe({
      next: (res) => {
        this.programs = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load training programs';
        this.loading = false;
      }
    });
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this training program?')) return;
    this.api.deleteTrainingProgram(id).subscribe({
      next: () => {
        this.programs = this.programs.filter(p => p.id !== id);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete program';
      }
    });
  }
}
