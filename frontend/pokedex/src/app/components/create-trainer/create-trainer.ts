import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainerService } from '../../services/trainer';

@Component({
    selector: 'app-create-trainer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-trainer.html',
    styleUrl: './create-trainer.css'
})
export class CreateTrainer {
    trainerName = '';
    selectedAvatar = '';
    error = '';

    avatars = [
        { name: 'Sacha', url: 'https://www.pokepedia.fr/images/thumb/a/ae/Sacha-Anim%C3%A9_LV.png/175px-Sacha-Anim%C3%A9_LV.png' },
        { name: 'Ondine', url: 'https://www.pokepedia.fr/images/thumb/3/39/Ondine-LGPE.png/250px-Ondine-LGPE.png' },
        { name: 'Pierre', url: 'https://www.pokepedia.fr/images/thumb/7/73/Pierre-LGPE.png/150px-Pierre-LGPE.png' },
        { name: 'Red', url: 'https://www.pokepedia.fr/images/thumb/f/f3/Red-LGPE.png/200px-Red-LGPE.png' },
        { name: 'Blue', url: 'https://www.pokepedia.fr/images/thumb/8/87/Blue-LGPE.png/175px-Blue-LGPE.png' },
        { name: 'Leaf', url: 'https://www.pokepedia.fr/images/thumb/2/28/Green-LGPE.png/150px-Green-LGPE.png' }
    ];

    constructor(private trainerService: TrainerService, private router: Router) { }

    selectAvatar(url: string) {
        this.selectedAvatar = url;
    }

    onSubmit() {
        if (!this.trainerName || !this.selectedAvatar) {
            this.error = 'Veuillez choisir un nom et un avatar.';
            return;
        }

        this.trainerService.createTrainer(this.trainerName, this.selectedAvatar).subscribe({
            next: () => {
                this.router.navigate(['/pokedex']);
            },
            error: (err) => {
                this.error = err.error.message || 'Erreur lors de la création du trainer.';
            }
        });
    }
}
