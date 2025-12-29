import { ApolloServer } from "@apollo/server";
import { assert } from "node:console";
import { describe, expect, test } from "@jest/globals";
import loadMergeSchema from "../graphql/loadMergedSchema";
import AppResolver from "../resolvers/AppResolver";

describe("default graphql queries and mutations", () => {
  test(`testList"`, async () => {
    const testServer = new ApolloServer({
      typeDefs: loadMergeSchema,
      resolvers: AppResolver,
    });

    const QUERY = `
      query testList {
        testList
      }
    `;

    const response: any = await testServer.executeOperation({
      query: QUERY,
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data.testList).toBeDefined();
  });

  test(`testDetail`, async () => {
    const testServer = new ApolloServer({
      typeDefs: loadMergeSchema,
      resolvers: AppResolver,
    });

    const id = 1;

    const QUERY = `
      query testDetail($id: Int!) {
        testDetail(id: $id)
      }
    `;

    const response: any = await testServer.executeOperation({
      query: QUERY,
      variables: {
        id: id,
      },
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data.testDetail).toBeDefined();
  });

  test(`createTest"`, async () => {
    const testServer = new ApolloServer({
      typeDefs: loadMergeSchema,
      resolvers: AppResolver,
    });

    const MUTATION = `
      mutation createTest($input: TestInput) {
        createTest(input: $input)
      }
    `;

    const response: any = await testServer.executeOperation({
      query: MUTATION,
      variables: {
        input: {
          message: "hello",
        },
      },
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data.createTest).toBeGreaterThan(0);
  });

  test(`updateTest"`, async () => {
    const testServer = new ApolloServer({
      typeDefs: loadMergeSchema,
      resolvers: AppResolver,
    });

    const MUTATION = `
      mutation updateTest($id: Int!, $input: TestInput) {
        updateTest(id: $id, input: $input)
      }
    `;

    const response: any = await testServer.executeOperation({
      query: MUTATION,
      variables: {
        id: 1,
        input: {
          message: "hello",
        },
      },
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data.updateTest).toBeTruthy();
  });
});
