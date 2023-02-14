import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../src/server.js";
import ProductsModel from "../src/api/products/model.js";

dotenv.config(); // This command forces .env vars to be loaded into process.env. This is the way to do it whenever you can't use -r dotenv/config

// supertest is capable of executing server.listen of our Express app if we pass the Express server to it
// It will give us back a client that can be used to run http requests on that server

const client = supertest(server);

/* describe("Test APIs", () => {
  it("Should test that GET /test endpoint returns 200 and a body containing a message", async () => {
    const response = await client.get("/test")
    expect(response.status).toBe(200)
    expect(response.body.message).toEqual("Test successfull")
  })
})
 */

const validProduct = {
  name: "A valid product",
  description: "balllablalblabl",
  price: 100,
};

const notValidProduct = {
  name: "not a valid product",
  price: 100,
};

const putData = {
  name: "newName",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);
  const product = new ProductsModel(validProduct);
  await product.save();
});
// beforeAll is a Jest hook ran before all the tests, usually it is used to connect to the db and to do some initial setup (like inserting some mock data in the db)

afterAll(async () => {
  await ProductsModel.deleteMany();
  await mongoose.connection.close();
});
// afterAll hook could be used to clean up the situation (close the connection to Mongo gently and clean up db/collections)

describe("Test APIs", () => {
  it("Should test that the env vars are set correctly", () => {
    expect(process.env.MONGO_URL_TEST).toBeDefined();
  });

  // exercise nr 1

  it("Should test that GET /products returns a success status and a body", async () => {
    const response = await client.get("/products").expect(200);
    console.log(response.body);
  });

  // exercise nr 2

  it("Should test that POST /products returns a valid _id and 201", async () => {
    const response = await client
      .post("/products")
      .send(validProduct)
      .expect(201);
    expect(response.body._id).toBeDefined();
  });

  // exercise nr 2a
  it("Should test that POST /products with a not valid product returns a 400", async () => {
    await client.post("/products").send(notValidProduct).expect(400);
  });

  // exercise nr 3
  it("Should test that GET /products/:id with a non-existing ID returns 404", async () => {
    await client.get("/products/123456123456123456123456").expect(404);
  });

  // exercise nr 3a

  it("Should test that GET /products/:id returns the correct product", async () => {
    const response = await client.get("/products");
    console.log(response.body[0]);
    const initialResponseId = response.body[0]._id;
    const response2 = await client
      .get("/products/" + initialResponseId)
      .expect(200);
    expect(response2.body._id).toEqual(initialResponseId);
  });

  // exercise nr 4
  it("Should test that DELETE /products/:id returns 204 after deletion", async () => {
    const response = await client.get("/products");
    console.log(response.body[0]);
    const initialResponseId = response.body[0]._id;
    const response2 = await client
      .delete("/products/" + initialResponseId)
      .expect(204);
  });

  // exercise nr 4a

  it("Should test that DELETE /products/:id with a non-existing ID returns 404", async () => {
    await client.delete("/products/123456123456123456123456").expect(404);
  });

  // exercise nr 5

  it("Should test that PUT /products/:id accepts requests", async () => {
    const response = await client.get("/products");
    console.log(response.body[0]);
    const initialResponseId = response.body[0]._id;
    const response2 = await client
      .put("/products/" + initialResponseId)
      .expect(200);
  });

  // exercise nr 5a

  it("Should test that PUT /products/:id with a non-existing ID returns 404", async () => {
    await client.put("/products/123456123456123456123456").expect(404);
  });

  // exercise nr 5b

  it("Should test that editing a product name with PUT /products/:id is successful", async () => {
    const response = await client.get("/products");
    console.log(response.body[0]);
    const initialResponseId = response.body[0]._id;
    const initialResponseName = response.body[0].name;
    const response2 = await client
      .put("/products/" + initialResponseId)
      .send(putData)
      .expect(200);
    expect(response2.body.name).toEqual("newName");
  });

  // exercise nr 5c

  it("Should test that the type of name in a response from PUT /products/:id is 'string'", async () => {
    const response = await client.get("/products");
    console.log(response.body[0]);
    const initialResponseId = response.body[0]._id;
    const initialResponseName = response.body[0].name;
    const response2 = await client
      .put("/products/" + initialResponseId)
      .send(putData)
      .expect(200);
    expect(typeof response2.body.name).toEqual("string");
  });
});
