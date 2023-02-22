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
