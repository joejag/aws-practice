import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as A from "../lib/a-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  const stack = new A.AStack(app, "MyTestStack");
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
