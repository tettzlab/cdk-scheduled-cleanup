import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import * as CdkApp from '../src/cdk-basics-cloudwatch-events-lambda-stack'

test('CDK code synthesize', () => {
  const app = new cdk.App()
  const stack = new CdkApp.CdkBasicsCloudWatchEventsLambdaStack(app, 'MyTestStack')
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 0)
})
