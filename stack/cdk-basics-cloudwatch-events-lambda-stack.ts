import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CloudWatchEventsLambda } from '../lib/cloudwatch-events-lambda'

export class CdkBasicsCloudWatchEventsLambdaStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const cloudWatchEventsLambda = new CloudWatchEventsLambda(this, 'CloudWatchEventsLambda', {})

    // TODO: output the resource ARNs.
    // new CfnOutput(...)
  }
}
