import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { TrainerService } from '../../services/trainer';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: Auth,
    private trainerService: TrainerService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.trainerService.getTrainer().subscribe({
          next: () => this.router.navigate(['/pokedex']),
          error: () => this.router.navigate(['/create-trainer'])
        });
      },
      error: (err) => this.error = err.error.message || 'Login failed'
    });
  }
}