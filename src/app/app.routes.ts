import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SearchComponent } from './pages/search/search';
import { TrainingDetailsComponent } from './pages/training-details/training-details';
import { LoginComponent as AdminLoginComponent } from './pages/admin/login/login';
import { DashboardComponent as AdminDashboardComponent } from './pages/admin/dashboard/dashboard';
import { SessionsListComponent } from './pages/admin/sessions/sessions-list';
import { SessionFormComponent } from './pages/admin/sessions/session-form';
import { TrainersListComponent } from './pages/admin/trainers/trainers-list';
import { TrainerFormComponent } from './pages/admin/trainers/trainer-form';
import { TrainingProgramsListComponent } from './pages/admin/training-programs/training-programs-list';
import { TrainingProgramFormComponent } from './pages/admin/training-programs/training-program-form';
import { CandidatesListComponent } from './pages/admin/candidates/candidates-list';
import { CandidateFormComponent } from './pages/admin/candidates/candidate-form';
import { CategoriesListComponent } from './pages/admin/categories/categories-list';
import { CategoryFormComponent } from './pages/admin/categories/category-form';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/login', pathMatch: 'full' },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'trainings/:id', component: TrainingDetailsComponent },
  {
    path: 'admin',
    children: [
      { path: '', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      // Sessions
      { path: 'sessions', component: SessionsListComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'sessions/new', component: SessionFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'sessions/:id/edit', component: SessionFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      // Trainers
      { path: 'trainers', component: TrainersListComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'trainers/new', component: TrainerFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'trainers/:id/edit', component: TrainerFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      // Training Programs
      { path: 'training-programs', component: TrainingProgramsListComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'training-programs/new', component: TrainingProgramFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'training-programs/:id/edit', component: TrainingProgramFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      // Candidates
      { path: 'candidates', component: CandidatesListComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'candidates/new', component: CandidateFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'candidates/:id/edit', component: CandidateFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      // Categories
      { path: 'categories', component: CategoriesListComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'categories/new', component: CategoryFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } },
      { path: 'categories/:id/edit', component: CategoryFormComponent, canActivate: [AuthGuard], data: { requireAdminAuth: true } }
    ]
  },
  { path: '**', redirectTo: '/admin/login' }
];
