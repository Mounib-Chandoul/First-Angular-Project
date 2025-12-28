import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-candidates-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidates-list.html',
  styleUrl: './candidates-list.css'
})
export class CandidatesListComponent implements OnInit {
  candidates: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    this.error = '';
    this.api.getCandidates().subscribe({
      next: (res) => {
        this.candidates = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load candidates';
        this.loading = false;
      }
    });
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    this.api.deleteCandidate(id).subscribe({
      next: () => {
        this.candidates = this.candidates.filter(c => c.id !== id);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete candidate';
      }
    });
  }
}
