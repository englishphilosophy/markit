import { assertEquals, assertRejects } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import compile from "../src/compile.ts";

// TODO
describe("compile api", () => {
  it("throws an error if the input path does not exist", () => {});
  it("compiles a single markit file", () => {});
  it("compiles all markit files in a directory", () => {});
  it("throws an error if the context directory does not exist", () => {});
  it("compiles a single markit file with a context directory", () => {});
  it("compiles all markit files in a directory with a context directory", () => {});
  it("writes the output to the output directory", () => {});
  it("clears the context cache if clearContextCache is true", () => {});
});
