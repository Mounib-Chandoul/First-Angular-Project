import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-form.html',
  styleUrl: './session-form.css'
})
export class SessionFormComponent implements OnInit {
  model: any = { title: '', date: '', capacity: 0, trainingId: null, trainer_id: null, trainer_id_2: null };
  trainers: any[] = [];
  trainings: any[] = [];
  loading = false;
  saving = false;
  error = '';
  isEdit = false;
  documentFile: File | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadTrainers();
    this.loadTrainings();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.api.getSession(id).subscribe({
        next: (res) => {
          this.model = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.message || 'Failed to load session';
          this.loading = false;
        }
      });
    }
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

  loadTrainings() {
    this.api.getTrainingPrograms().subscribe({
      next: (res: any[]) => {
        this.trainings = res || [];
      },
      error: () => {
        this.trainings = [];
      }
    });
  }

  onDocumentSelected(e: any) {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.documentFile = file;
    } else {
      this.error = 'Please select a PDF file';
      this.documentFile = null;
    }
  }

  save() {
    if (!this.model.title || !this.model.date) {
      this.error = 'Title and date are required';
      return;
    }

    // Trainer validation: max 2 trainers, prevent selecting same trainer twice
    const trainer1 = this.model.trainer_id;
    const trainer2 = this.model.trainer_id_2;
    
    if (trainer1 && trainer2 && trainer1 === trainer2) {
      this.error = 'Cannot assign the same trainer twice';
      return;
    }

    this.saving = true;
    this.error = '';

    const formData = new FormData();
    formData.append('title', this.model.title);
    formData.append('date', this.model.date);
    formData.append('capacity', String(this.model.capacity || 0));
    formData.append('trainingId', String(this.model.trainingId || ''));
    formData.append('trainer_id', String(this.model.trainer_id || ''));
    if (this.model.trainer_id_2) {
      formData.append('trainer_id_2', String(this.model.trainer_id_2));
    }
    if (this.documentFile) {
      formData.append('document', this.documentFile);
    }

    const op = this.isEdit 
      ? this.api.updateSession(this.model.id, this.model)
      : this.api.createSession(this.model);

    op.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/sessions']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.message || 'Save failed';
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/sessions']);
  }
}
