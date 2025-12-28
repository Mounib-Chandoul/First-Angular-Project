import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryFormComponent implements OnInit {
  isEdit = false;
  categoryId = '';

  form = {
    name: '',
    description: ''
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
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    if (this.categoryId) {
      this.isEdit = true;
      this.loadCategory();
    }
  }

  loadCategory() {
    this.loading = true;
    this.api.getCategory(this.categoryId).subscribe({
      next: (res) => {
        this.form = {
          name: res.name || '',
          description: res.description || ''
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load category';
        this.loading = false;
      }
    });
  }

  submit() {
    this.error = '';
    if (!this.form.name) {
      this.error = 'Category name is required';
      return;
    }

    this.saving = true;
    const payload = {
      name: this.form.name,
      description: this.form.description
    };

    const request = this.isEdit
      ? this.api.updateCategory(this.categoryId, payload)
      : this.api.createCategory(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Operation failed';
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
