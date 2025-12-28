import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-trainer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-form.html',
  styleUrl: './trainer-form.css'
})
export class TrainerFormComponent implements OnInit {
  isEdit = false;
  trainerId = '';
  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idCardNumber: '',
    specialties: '',
    cvFile: null as File | null
  };

  loading = false;
  saving = false;
  error = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.trainerId = this.route.snapshot.paramMap.get('id') || '';
    if (this.trainerId) {
      this.isEdit = true;
      this.loadTrainer();
    }
  }

  loadTrainer() {
    this.loading = true;
    this.api.getTrainer(this.trainerId).subscribe({
      next: (res) => {
        this.form = {
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          email: res.email || '',
          phone: res.phone || '',
          idCardNumber: res.idCardNumber || '',
          specialties: (res.specialties || []).join(', '),
          cvFile: null
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load trainer';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.form.cvFile = file;
    } else {
      this.error = 'Please select a PDF file';
    }
  }

  submit() {
    this.error = '';
    if (!this.form.firstName || !this.form.lastName || !this.form.email) {
      this.error = 'First name, last name, and email are required';
      return;
    }

    this.saving = true;
    const payload = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      phone: this.form.phone,
      idCardNumber: this.form.idCardNumber,
      specialties: this.form.specialties.split(',').map(s => s.trim()).filter(s => s)
    };

    const request = this.isEdit 
      ? this.api.updateTrainer(this.trainerId, payload)
      : this.api.createTrainer(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/trainers']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Operation failed';
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/trainers']);
  }
}
