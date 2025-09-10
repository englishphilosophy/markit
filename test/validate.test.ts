import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertRejects } from "@std/assert";
import validate from "../src/validate.ts";

// TODO
describe("validate api", () => {
  it("throws an error if the input path does not exist", () => {});
  it("validates a single markit file", () => {});
  it("validates all markit files in a directory", () => {});
  it("throws an error if the context directory does not exist", () => {});
  it("validates a single markit file with a context directory", () => {});
  it("validates all markit files in a directory with a context directory", () => {});
  it("logs errors if logErrors is true", () => {});
  it("clears the context cache if clearContextCache is true", () => {});
});
