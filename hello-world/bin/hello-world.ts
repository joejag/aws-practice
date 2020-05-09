#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { HelloWorldStack } from "../lib/hello-world-stack";

const app = new cdk.App();

new HelloWorldStack(app, "HelloWorldStack");
