import express from "express"; // import express
import {Request, Response} from "express";
import mongoose from "mongoose";
import request from "supertest"; // supertest is a framework that allows to easily test web apis
let app: express.Application //an instance of an express app, a 'fake' express app

import {EditionsController} from "../controllers"; //import file we are testing
import {EditionService} from "../services/editions.service"; //import file we are testing

beforeAll(() => {
    app = express();

    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use((request: Request, response: Response, next: () => any) => next());

    const editionsController = new EditionsController(new EditionService());
    app.use("/editions", editionsController.router); //routes

    mongoose.Promise = global.Promise;
    mongoose.set("toJSON", {
        virtuals: true,
        transform: (_: any, converted: any) => {
            delete converted._id;
        },
    });
    mongoose.connect(
        `mongodb://${process.env.DB_DEV_HOST}/${process.env.DB_NAME}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    );

    app.listen('10300', () => {
        console.log(`Server listening on port 10300`);
    });
});

afterAll(() => {
    mongoose.disconnect();
    app.removeAllListeners();
});

// jest.setTimeout(10000);
jest.mock("./save_json", () => ({
    save: jest.fn(),
}));

describe("test-editions-endpoint", () => {
    it("GET /editions - no data", async () => {
        const {body} = await request(app).get("/editions"); //uses the request function that calls on express app instance
        expect(body).toEqual([]);
    });

    it("GET /editions - some data", async () => {
        const { body } = await request(app).get("/states"); //uses the request function that calls on express app instance
        expect(body).toEqual([
            {
                state: "NJ",
                capital: "Trenton",
                governor: "Phil Murphy",
            },
            {
                state: "CT",
                capital: "Hartford",
                governor: "Ned Lamont",
            },
            {
                state: "NY",
                capital: "Albany",
                governor: "Andrew Cuomo",
            },
        ]);
    });

    it("POST /editions - success", async () => {
        let stateObj = {
            state: "AL",
            capital: "Montgomery",
            governor: "Kay Ivey",
        };
        const { body } = await request(app).post("/states").send(stateObj);
        expect(body).toEqual({
            status: "success",
            stateInfo: {
                state: "AL",
                capital: "Montgomery",
                governor: "Kay Ivey",
            },
        });
        expect(jest.mock("save")).toHaveBeenCalledWith([
            {
                state: "MI",
                capital: "Lansing",
                governor: "Gretchen Whitmer",
            },
            {
                state: "GA",
                capital: "Atlanta",
                governor: "Brian Kemp",
            },
            {
                state: "AL",
                capital: "Montgomery",
                governor: "Kay Ivey",
            },
        ]);
    });
});