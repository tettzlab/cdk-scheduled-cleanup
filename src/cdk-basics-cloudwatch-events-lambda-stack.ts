import { Stack, StackProps, RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib'
// import * as iam from 'aws-cdk-lib/aws-iam'
// import * as events from 'aws-cdk-lib/aws-events'
// import * as targets from 'aws-cdk-lib/aws-events-targets'
// import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class CdkBasicsCloudWatchEventsLambdaStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // TODO: create lambda function.
    // const myLambda = new Function(...)

    // TODO: attach inline policy to the lambda.
    // myLambda.role?.attachInlinePolicy(...)

    // TODO: create cloudwatch events rule.
    // const eventRule = new events.Rule(...)

    // TODO: add the lambda function as the target to the event.
    // eventRule.addTarget(...)

    // TODO: output the resource ARNs.
    // new CfnOutput(...)

  }
}
