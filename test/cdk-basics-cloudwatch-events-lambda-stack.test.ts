import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import * as CdkApp from '../stack/cdk-basics-cloudwatch-events-lambda-stack'

describe('CdkBasicsCloudWatchEventsLambdaStack', () => {
  const app = new cdk.App()
  const stack = new CdkApp.CdkBasicsCloudWatchEventsLambdaStack(app, 'MyTestStack')

  test('should have 1 lambda functions.', () => {
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1)
  })
})
