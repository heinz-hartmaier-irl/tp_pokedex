import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../services/trainer';
import { Auth } from '../../services/auth';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  trainer: Trainer | null = null;
  loading = true;
  isAdmin = false;


  constructor(
    private trainerService: TrainerService,
    private authService: Auth
  ) { }

  ngOnInit() {
    // 1. Early role check
    this.isAdmin = this.authService.getRole() === 'ADMIN';

    // 2. Try to load from cache
    const cached = sessionStorage.getItem('trainer_cache');
    if (cached) {
      this.trainer = JSON.parse(cached);
      this.loading = false;
    }

    // 3. Fetch fresh data
    this.trainerService.getTrainer().subscribe({
      next: (data) => {
        this.trainer = data;
        sessionStorage.setItem('trainer_cache', JSON.stringify(data));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}


