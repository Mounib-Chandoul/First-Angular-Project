import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css'
})
export class CategoriesListComponent implements OnInit {
  categories: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = '';
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this.api.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete category';
      }
    });
  }
}
