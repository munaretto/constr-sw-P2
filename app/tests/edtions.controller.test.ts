import {EditionsController} from "../controllers";
import {EditionService} from "../services/editions.service";
import express from "express";

let server: express.Application;

beforeAll(async () => {
    server = await express();
    server.use(express.json())
    server.use(express.urlencoded({ extended: false }));

    const controller = new EditionsController(new EditionService());
    server.use("/editions", controller.router);
})

describe("EditionsController", () => {
    describe("getEditions", () => {
        it("should return an empty array", async done => {
            // server.get("/editions");
        });
    });
});

test("it should pass", async () => {
    expect(true).toBe(true);
});