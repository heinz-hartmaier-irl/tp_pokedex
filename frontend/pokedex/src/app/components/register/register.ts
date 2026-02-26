import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: Auth, private router: Router) { }

  register() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        // Automatically login or redirect to login
        this.router.navigate(['/login']);
      },
      error: (err) => (this.error = err.error.message || 'Registration failed'),
    });
  }
}

