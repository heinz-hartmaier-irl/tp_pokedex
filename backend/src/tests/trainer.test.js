const request = require("supertest");
const app = require("../../app");

let token;
let trainerId;
let pokemonId;

describe("Trainer API", () => {

  beforeAll(async () => {
    // Register un ADMIN pour obtenir le token
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "TrainerAdmin",  // nécessaire pour l'auth mais pas dans Trainer
        email: "trainer@test.com",
        password: "123456",
        role: "ADMIN"
      });

    // Login pour récupérer le token
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "trainer@test.com",
        password: "123456"
      });

    token = res.body.token;

    // Créer un Pokémon pour les tests
    const pokeRes = await request(app)
      .post("/api/pkmn")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Venusaur",
        types: ["PLANTE", "POISON"],
        description: "Evolution finale de Bulbizare",
        imgUrl: "https://archives.bulbagarden.net/media/upload/a/ae/0003Venusaur.png"
      });

    pokemonId = pokeRes.body._id;
  });

  it("should create a trainer", async () => {
    const res = await request(app)
      .post("/api/trainer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        trainerName: "Ash Ketchum" // seul champ obligatoire
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.trainerName).toBe("Ash Ketchum");
    trainerId = res.body._id;
  });

  it("should get trainer info", async () => {
    const res = await request(app)
      .get(`/api/trainer/${trainerId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("trainerName");
  });

  it("should update trainer info", async () => {
    const res = await request(app)
      .put(`/api/trainer/${trainerId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ trainerName: "Ash K." }); 

    expect(res.statusCode).toBe(200);
    expect(res.body.trainerName).toBe("Ash K.");
  });

  it("should delete trainer", async () => {
    const res = await request(app)
      .delete(`/api/trainer/${trainerId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});