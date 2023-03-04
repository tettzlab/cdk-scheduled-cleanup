import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import * as events from 'aws-cdk-lib/aws-events'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { CloudWatchEventsLambda } from '../lib/cloudwatch-events-lambda'

export class CdkScheduledCleanupStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const schedule = events.Schedule.cron({ hour: '0/3', minute: '0' })
    const cloudWatchEventsLambda = new CloudWatchEventsLambda(this, 'CloudWatchEventsLambda', {
      lambdaPolicyStatements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:ListUsers',
            'iam:ListAccessKeys',
            'iam:DeleteAccessKey',
            'iam:UpdateAccessKey',
          ],
          resources: ['*'],
        }),
      ],
      schedule,
    })

    new CfnOutput(this, 'Schedule', {
      value: schedule.expressionString,
    })
    new CfnOutput(this, 'ScheduledLambdaFunction', {
      value: cloudWatchEventsLambda.lambdaFunc.functionArn,
    })
  }
}
