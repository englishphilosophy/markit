import { assertEquals } from "@std/assert";
import { validateMarkit } from "../../src/lib/validate.ts";

export const assertHeadContentGivesErrors = ({
  filePath,
  headContent,
  expectedErrors,
}: {
  filePath: string;
  headContent: string[];
  expectedErrors: string[];
}) => {
  const fullContent = ["---", ...headContent, "---"];
  assertFullContentGivesErrors({ filePath, fullContent, expectedErrors });
};

export const assertBlockContentGivesErrors = ({
  id,
  blockContent,
  expectedErrors,
}: {
  id: string;
  blockContent: string;
  expectedErrors: string[];
}) => {
  const filePath = "doesn't matter";
  const fullContent = ["---", `id: ${id}`, "---", blockContent];
  assertFullContentGivesErrors({ filePath, fullContent, expectedErrors });
};

export const assertFullContentGivesErrors = ({
  filePath,
  fullContent,
  expectedErrors,
}: {
  filePath: string;
  fullContent: string[];
  expectedErrors: string[];
}) => {
  const errors = validateMarkit(filePath, fullContent.join("\n"));
  assertEquals(errors, expectedErrors);
};
