import { Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { S3EventSource, S3EventSourceProps } from 'aws-cdk-lib/aws-lambda-event-sources'
import { Construct } from 'constructs'

interface CloudWatchEventsLambdaProps extends StackProps {
  lambdaProps?: lambda.FunctionProps
}

export class CloudWatchEventsLambda extends Construct {
  public readonly lambdaFunc: lambda.Function

  public constructor(scope: Construct, id: string, props?: CloudWatchEventsLambdaProps) {
    super(scope, id)

    // TODO: create lambda function.
    this.lambdaFunc = new lambda.Function(this, 'Function', {
      architecture: lambda.Architecture.X86_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./bundle/mylambda', {}),
      handler: 'index.handler',
      // TODO ...
      environment: {},
      ...(props?.lambdaProps ?? {}),
    })

    // TODO: attach inline policy to the lambda.
    // myLambda.role?.attachInlinePolicy(...)

    // TODO: create cloudwatch events rule.
    // const eventRule = new events.Rule(...)

    // TODO: add the lambda function as the target to the event.
    // eventRule.addTarget(...)
  }
}
