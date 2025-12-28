import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-training-program-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-program-form.html',
  styleUrl: './training-program-form.css'
})
export class TrainingProgramFormComponent implements OnInit {
  isEdit = false;
  programId = '';
  categories: any[] = [];

  form = {
    title: '',
    description: '',
    duration: '',
    difficultyLevel: 'Beginner',
    category: '',
    keywords: '',
    documentFile: null as File | null
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
    this.loadCategories();
    this.programId = this.route.snapshot.paramMap.get('id') || '';
    if (this.programId) {
      this.isEdit = true;
      this.loadProgram();
    }
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories = res || [];
      },
      error: () => {}
    });
  }

  loadProgram() {
    this.loading = true;
    this.api.getTrainingProgram(this.programId).subscribe({
      next: (res) => {
        this.form = {
          title: res.title || '',
          description: res.description || '',
          duration: res.duration || '',
          difficultyLevel: res.difficultyLevel || 'Beginner',
          category: res.category || '',
          keywords: (res.keywords || []).join(', '),
          documentFile: null
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load program';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.form.documentFile = file;
    } else {
      this.error = 'Please select a PDF file';
    }
  }

  submit() {
    this.error = '';
    if (!this.form.title || !this.form.description || !this.form.duration || !this.form.category) {
      this.error = 'Title, description, duration, and category are required';
      return;
    }

    this.saving = true;
    const payload = {
      title: this.form.title,
      description: this.form.description,
      duration: this.form.duration,
      difficultyLevel: this.form.difficultyLevel,
      category: this.form.category,
      keywords: this.form.keywords.split(',').map(k => k.trim()).filter(k => k)
    };

    const request = this.isEdit
      ? this.api.updateTrainingProgram(this.programId, payload)
      : this.api.createTrainingProgram(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/training-programs']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Operation failed';
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/training-programs']);
  }
}
