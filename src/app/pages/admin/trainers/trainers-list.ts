import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-trainers-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trainers-list.html',
  styleUrl: './trainers-list.css'
})
export class TrainersListComponent implements OnInit {
  trainers: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.loading = true;
    this.error = '';
    this.api.getTrainers().subscribe({
      next: (res) => {
        this.trainers = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load trainers';
        this.loading = false;
      }
    });
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this trainer?')) return;
    this.api.deleteTrainer(id).subscribe({
      next: () => {
        this.trainers = this.trainers.filter(t => t.id !== id);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete trainer';
      }
    });
  }
}
