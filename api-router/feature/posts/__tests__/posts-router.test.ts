/**
 * @codex-purpose: Unit and integration tests for Posts API routes.
 * @codex-system: Dream-State Router Testing Layer
 * @codex-critical: Ensures operational resilience, Golden Output compliance, and emotional UX fidelity for post-related flows.
 * @codex-verified: v1.0.0
 */

import request from "supertest";
import { app } from "../../../../server"; // Assuming server.ts exports your Express app

describe("Posts Router", () => {
  
  describe("POST /api/posts/create", () => {
    it("should create a post with valid input", async () => {
      const response = await request(app)
        .post("/api/posts/create")
        .send({
          title: "Test Post",
          content: "This is a test content."
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.payload).toHaveProperty("message");
      expect(response.body.errors.length).toBe(0);
    });

    it("should return 400 with invalid input", async () => {
      const response = await request(app)
        .post("/api/posts/create")
        .send({
          title: "", // invalid title (empty)
          content: "" // invalid content (empty)
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.payload).toBeNull();
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/posts/:id", () => {
    it("should retrieve a post by id", async () => {
      const response = await request(app)
        .get("/api/posts/123");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payload).toHaveProperty("id", "123");
      expect(response.body.payload).toHaveProperty("title");
      expect(response.body.payload).toHaveProperty("content");
      expect(response.body.errors.length).toBe(0);
    });
  });

});
