import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as HelloWorld from '../lib/hello-world-stack'

test('SQS Queue Created', () => {
  const app = new cdk.App()
  const stack = new HelloWorld.HelloWorldStack(app, 'MyTestStack')
  expectCDK(stack).to(haveResource('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  }))
})

test('SNS Topic Created', () => {
  const app = new cdk.App()
  const stack = new HelloWorld.HelloWorldStack(app, 'MyTestStack')
  expectCDK(stack).to(haveResource('AWS::SNS::Topic'))
})
