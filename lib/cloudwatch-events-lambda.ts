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
  // grantActions?: [string, ...string[]]
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
      code: lambda.Code.fromAsset(props.lambdaCodePath ?? './bundle/mylambda', {}),
      handler: props.lambdaHandler ?? 'index.handler',
      timeout: props.timeout,
      memorySize: props.memorySize,
      ephemeralStorageSize: props.ephemeralStorageSize,
      environment: {
        REGION: Stack.of(this).region,
        ACCOUNT: Stack.of(this).region,
        ...(props.environment ?? {}),
      },
      ...(props.lambdaProps ?? {}),
    })
    this.lambdaFunc.role?.attachInlinePolicy(
      new iam.Policy(this, 'LambdaPolicy', {
        statements: props.lambdaPolicyStatements ?? [],
      })
    )
    const eventRule = new events.Rule(this, 'LambdaSchedule', {
      schedule: props.schedule,
    })
    eventRule.addTarget(new targets.LambdaFunction(this.lambdaFunc))
  }
}
