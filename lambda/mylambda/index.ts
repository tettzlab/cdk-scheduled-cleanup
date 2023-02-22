import { Context, ScheduledEvent } from 'aws-lambda'

export async function handler(event: ScheduledEvent, context: Context): Promise<object> {
  try {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`)
    console.log(`Context: ${JSON.stringify(context, null, 2)}`)

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  } catch (err: unknown) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err }),
    }
  }
}

// {
//   "version": "0",
//   "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxfff",
//   "detail-type": "Scheduled Event",
//   "source": "aws.events",
//   "account": "012345678901",
//   "time": "2023-02-22T15:25:00Z",
//   "region": "us-east-1",
//   "resources": [
//       "arn:aws:events:us-east-1:012345678901:rule/CdkBasicsCloudWatchEvents-CloudWatchEventsLambdasc-XXXXXXXXXXXXX"
//   ],
//   "detail": {}
// }
