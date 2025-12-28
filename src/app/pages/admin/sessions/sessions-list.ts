import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-sessions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sessions-list.html',
  styleUrl: './sessions-list.css'
})
export class SessionsListComponent implements OnInit {
  sessions: any[] = [];
  trainers: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadTrainers();
    this.load();
  }

  loadTrainers() {
    this.api.getTrainers().subscribe({
      next: (res: any[]) => {
        this.trainers = res || [];
      },
      error: () => {
        this.trainers = [];
      }
    });
  }

  load() {
    this.loading = true;
    this.api.getSessions().subscribe({
      next: (res: any[]) => {
        this.sessions = (res || []).map(s => ({
          ...s,
          trainerName: this.getTrainerName(s.trainer_id),
          enrollmentStatus: `${s.enrolled_count || 0}/15`,
          isFull: (s.enrolled_count || 0) >= 15
        }));
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to load sessions';
        this.loading = false;
      }
    });
  }

  getTrainerName(trainerId: any): string {
    if (!trainerId) return '-';
    const trainer = this.trainers.find(t => t.id == trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : '-';
  }

  edit(s: any) {
    this.router.navigate([`/admin/sessions/${s.id}/edit`]);
  }

  create() {
    this.router.navigate(['/admin/sessions/new']);
  }

  remove(s: any) {
    if (!confirm('Delete this session?')) return;
    this.api.deleteSession(s.id).subscribe({
      next: () => this.load(),
      error: (err: any) => (this.error = err?.message || 'Delete failed')
    });
  }
}
