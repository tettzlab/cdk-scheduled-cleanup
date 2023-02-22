import { Stack, StackProps, RemovalPolicy, Duration, Size } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as events from 'aws-cdk-lib/aws-events'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as targets from 'aws-cdk-lib/aws-events-targets'
import { Construct } from 'constructs'

interface CloudWatchEventsLambdaProps extends StackProps {
  schedule: events.Schedule
  lambdaCodePath?: string
  lambdaHandler?: string
  environment?: { [key: string]: string }
  timeout?: Duration
  memorySize?: number
  ephemeralStorageSize?: Size
  lambdaProps?: lambda.FunctionProps
  lambdaPolicyStatements?: iam.PolicyStatement[]
}

export class CloudWatchEventsLambda extends Construct {
  public readonly lambdaFunc: lambda.Function

  public constructor(scope: Construct, id: string, props: CloudWatchEventsLambdaProps) {
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
