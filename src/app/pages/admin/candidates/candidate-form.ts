import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-form.html',
  styleUrl: './candidate-form.css'
})
export class CandidateFormComponent implements OnInit {
  isEdit = false;
  candidateId = '';

  form = {
    firstName: '',
    lastName: '',
    email: '',
    idCardNumber: '',
    password: '',
    photoFile: null as File | null
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
    this.candidateId = this.route.snapshot.paramMap.get('id') || '';
    if (this.candidateId) {
      this.isEdit = true;
      this.loadCandidate();
    }
  }

  loadCandidate() {
    this.loading = true;
    this.api.getCandidate(this.candidateId).subscribe({
      next: (res) => {
        this.form = {
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          email: res.email || '',
          idCardNumber: res.idCardNumber || '',
          password: '',
          photoFile: null
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load candidate';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.form.photoFile = file;
    } else {
      this.error = 'Please select an image file';
    }
  }

  submit() {
    this.error = '';
    if (!this.form.firstName || !this.form.lastName || !this.form.email) {
      this.error = 'First name, last name, and email are required';
      return;
    }

    if (!this.isEdit && !this.form.password) {
      this.error = 'Password is required for new candidates';
      return;
    }

    this.saving = true;
    const payload: any = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      idCardNumber: this.form.idCardNumber
    };

    if (this.form.password) {
      payload.password = this.form.password;
    }

    const request = this.isEdit
      ? this.api.updateCandidate(this.candidateId, payload)
      : this.api.createCandidate(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/candidates']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Operation failed';
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/candidates']);
  }
}
