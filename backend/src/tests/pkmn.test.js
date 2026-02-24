const request = require("supertest");
const app = require("../../app");

let token;
let pokemonId;

describe("Pokemon API", () => {

  beforeAll(async () => {
    // Register un ADMIN
    await request(app)
        .post("/auth/register")
        .send({
            username: "AdminUser",
            email: "admin@test.com",
            password: "123456",
            role: "ADMIN"
        });

    // Login pour récupérer le token
    const res = await request(app)
        .post("/auth/login")
        .send({
            email: "admin@test.com",
            password: "123456"
        });

        token = res.body.token;
    });

  // CREATE
  it("should create a pokemon", async () => {
    const res = await request(app)
      .post("/pkmn")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Venusaur",
        types: ["PLANTE", "POISON"],
        description: "Evolution finale de Bulbizare",
        imgUrl: "https://archives.bulbagarden.net/media/upload/a/ae/0003Venusaur.png"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Venusaur");
    expect(res.body.types).toContain("PLANTE");

    pokemonId = res.body._id;
  });

  // READ
  it("should get all pokemon", async () => {
    const res = await request(app)
      .get("/pkmn")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  // UPDATE
  it("should update a pokemon", async () => {
    const res = await request(app)
      .put(`/pkmn/${pokemonId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Pokemon électrique très rapide" });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Pokemon électrique très rapide");
  });

  // DELETE
  it("should delete a pokemon", async () => {
    const res = await request(app)
      .delete(`/pkmn/${pokemonId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});