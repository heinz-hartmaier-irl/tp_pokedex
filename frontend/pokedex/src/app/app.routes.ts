import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Pokedex } from './components/pokedex/pokedex';
import { Profile } from './components/profile/profile';
import { CreateTrainer } from './components/create-trainer/create-trainer';
import { AuthGuard } from './guards/auth-guard';


export const routes: Routes =
  [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'pokedex', component: Pokedex, canActivate: [AuthGuard] },
    { path: 'profile', component: Profile, canActivate: [AuthGuard] },
    { path: 'create-trainer', component: CreateTrainer, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  ];
