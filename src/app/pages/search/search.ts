import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent implements OnInit {
  q = '';
  loading = false;
  results: any[] = [];
  error = '';
  selectedCategory: any = null;
  categoryId: number | null = null;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['category'] ? Number(params['category']) : null;
      if (this.categoryId) {
        this.api.getCategories().subscribe({
          next: (cats: any[]) => {
            this.selectedCategory = cats.find(c => c.id === this.categoryId);
          }
        });
      }
    });
  }

  onSearch() {
    const query = this.q.trim();
    if (!query) {
      this.results = [];
      this.error = '';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.searchTrainings(query).subscribe({
      next: data => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error while searching. Check backend.';
        this.loading = false;
      }
    });
  }

  clear() {
    this.q = '';
    this.results = [];
    this.error = '';
  }
}
