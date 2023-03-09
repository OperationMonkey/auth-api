import { addition } from "../src";

describe("index tests", () => {
  it("should sum it up", () => {
    expect(addition(1, 1)).toEqual(2);
  });
});