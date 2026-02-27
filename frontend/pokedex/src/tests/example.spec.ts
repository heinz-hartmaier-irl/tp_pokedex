import { test, expect } from '@playwright/test';

test.describe('Pokedex App E2E', () => {

  test.beforeEach(async ({ page }) => {

    await page.route('**/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-jwt-token', message: 'Success' })
      });
    });

    await page.route('**/trainer*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          trainerName: 'Ash',
          imgUrl: 'asher.png',
          pkmnSeen: ['1'],
          pkmnCatch: []
        })
      });
    });

    await page.route('**/pkmn/search*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: '69a1905744ba7a6b46d73ec1',
            name: 'Bulbizarre',
            types: ['PLANTE', 'POISON'],
            description: "Au matin de sa vie...",
            category: 'Pokémon Graine',
            height: 0.7,
            weight: 6.9,
            stats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
            regions: [{ regionName: 'Kanto', regionPokedexNumber: 1 }],
            imgUrl: 'https://...',
            cryUrl: 'https://...',
            isLegendary: false
          }
        ])
      });
    });

  });

  test('La page de connexion s\'affiche correctement', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await expect(page.locator('h2')).toContainText('Bon retour !');
  });

  test('Connexion d\'un utilisateur', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.fill('#email', 'sacha@pallet.com');
    await page.fill('#password', 'pikachu123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/pokedex/);
  });

  test('La liste des Pokémon s\'affiche', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'fake-jwt-token');
    });

    await page.goto('http://localhost:4200/pokedex');

    const cards = page.locator('.pk-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Bulbizarre');
  });

  test('Navigation vers la page détail', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'fake-jwt-token');
    });

    await page.goto('http://localhost:4200/pokedex');

    await page.locator('.pk-card').first().click();
    await expect(page.locator('.detail-panel')).toBeVisible();
  });

});