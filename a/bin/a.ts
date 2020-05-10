#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AStack } from "../lib/a-stack";

const app = new cdk.App();
new AStack(app, "DynamoStack");
