import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.api.getCategories()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          console.log('HOME finalize -> loading false');
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log('HOME categories response:', data);
          this.categories = Array.isArray(data) ? data : [];
          if (this.categories.length === 0) {
            this.error = 'No categories available';
          }
        },
        error: (err: any) => {
          console.error('HOME categories error:', err);
          this.error = err?.error?.message || err?.message || 'Failed to load categories. Please check your connection and try again.';
        }
      });
  }

  retry(): void {
    this.loadCategories();
  }
}
