import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';
import { EnrollModalComponent } from '../enroll-modal/enroll-modal';


@Component({
  selector: 'app-training-details',
  standalone: true,
  imports: [CommonModule, RouterLink, EnrollModalComponent],
  templateUrl: './training-details.html',
  styleUrl: './training-details.css'
})
export class TrainingDetailsComponent implements OnInit, OnDestroy {
  loading = true;
  error = '';
  data: any = null;

  // Modal state
  enrollOpen = false;
  selectedSession: any = null;

  private sub?: Subscription;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    console.log('DETAILS COMPONENT LOADED ✅');

    this.sub = this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      const id = Number(idStr);

      console.log('DETAILS route param idStr =', idStr, '-> id =', id);

      if (!id || Number.isNaN(id)) {
        this.loading = false;
        this.error = 'Invalid training id';
        return;
      }

      this.loading = true;
      this.error = '';
      this.data = null;

      this.api.getTrainingDetails(id).subscribe({
        next: (res: any) => {
          console.log('DETAILS response ✅', res);
          this.data = res;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('DETAILS error ❌', err);
          this.error = err?.error?.message || err?.message || 'Failed to load details';
          this.loading = false;
        }
      });
    });
  }

  startEnroll(session: any): void {
    this.selectedSession = session;
    this.enrollOpen = true;
  }

  closeEnroll(): void {
    this.enrollOpen = false;
    this.selectedSession = null;
  }

  onEnrolled(): void {
    // Refresh the training details to show updated enrollment counts
    if (this.data?.training?.id) {
      this.api.getTrainingDetails(this.data.training.id).subscribe({
        next: (res: any) => {
          this.data = res;
        },
        error: (err: any) => {
          console.error('Failed to refresh training details:', err);
        }
      });
    }
  }

  downloadPDF(): void {
    if (this.data?.training?.program_pdf_url) {
      window.open(this.data.training.program_pdf_url, '_blank');
    } else {
      alert('PDF programme non disponible');
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
