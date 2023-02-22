import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import * as events from 'aws-cdk-lib/aws-events'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { CloudWatchEventsLambda } from '../lib/cloudwatch-events-lambda'

export class CdkBasicsCloudWatchEventsLambdaStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const cloudWatchEventsLambda = new CloudWatchEventsLambda(this, 'CloudWatchEventsLambda', {
      schedule: events.Schedule.cron({ hour: '0', minute: '0' }),
    })

    // TODO: output the resource ARNs.
    // new CfnOutput(...)
  }
}
