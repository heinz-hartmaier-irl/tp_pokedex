import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar {
    constructor(public authService: Auth) { }

    isAdmin(): boolean {
        return this.authService.getRole() === 'ADMIN';
    }

    logout() {
        this.authService.logout();
    }
}
