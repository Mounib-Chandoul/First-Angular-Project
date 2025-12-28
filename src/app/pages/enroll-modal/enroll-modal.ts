import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-enroll-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enroll-modal.html',
  styleUrl: './enroll-modal.css',
})
export class EnrollModalComponent {
  @Input() open = false;
  @Input() session: any = null;

  @Output() closed = new EventEmitter<void>();
  @Output() enrolled = new EventEmitter<void>(); // parent should refresh sessions

  firstName = '';
  lastName = '';
  email = '';

  loading = false;
  error = '';
  success = false;
  validationErrors: { [key: string]: string } = {};

  constructor(private api: ApiService) {}

  validateForm(): boolean {
    this.validationErrors = {};

    if (!this.firstName.trim()) {
      this.validationErrors['firstName'] = 'Prénom requis';
    }
    if (!this.lastName.trim()) {
      this.validationErrors['lastName'] = 'Nom requis';
    }
    if (!this.email.trim()) {
      this.validationErrors['email'] = 'Email requis';
    } else if (!this.isValidEmail(this.email)) {
      this.validationErrors['email'] = 'Email invalide';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  close(): void {
    this.error = '';
    this.success = false;
    this.loading = false;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.validationErrors = {};
    this.closed.emit();
  }

  submit(): void {
    this.error = '';

    if (!this.session?.id && !this.session?._id) {
      this.error = 'Invalid session.';
      return;
    }

    if (!this.validateForm()) {
      return;
    }

    const sessionId = this.session.id || this.session._id;

    const payload = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
    };

    this.loading = true;

    // Check for duplicate enrollment
    this.api.checkEnrollment(sessionId, payload.email)
      .subscribe({
        next: (isDuplicate: boolean) => {
          if (isDuplicate) {
            this.loading = false;
            this.error = 'Cet email est déjà inscrit à cette session.';
            return;
          }

          this.api.enrollToSession(sessionId, payload)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
              next: () => {
                this.success = true;
                setTimeout(() => {
                  this.enrolled.emit();
                  this.close();
                }, 1500);
              },
              error: (err: any) => {
                this.error =
                  err?.error?.message ||
                  err?.message ||
                  "Echec de l'inscription. Veuillez reessayer.";
              },
            });
        },
        error: () => {
          this.loading = false;
          this.error = 'Erreur lors de la verification de l\'inscription.';
        }
      });
  }
}
