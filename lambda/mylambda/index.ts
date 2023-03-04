import { Context, ScheduledEvent } from 'aws-lambda'
import * as iam from '@aws-sdk/client-iam'

const region = process.env.REGION
const iamClient = new iam.IAMClient({ region })

async function iamListUsers(): Promise<iam.User[]> {
  const list = []

  let ret = await iamClient.send(
    new iam.ListUsersCommand({
      MaxItems: 1000,
    })
  )
  if (ret.Users && ret.Users.length) {
    list.push(...ret.Users)
  }
  while (ret.IsTruncated) {
    ret = await iamClient.send(
      new iam.ListUsersCommand({
        MaxItems: 1000,
        Marker: ret.Marker,
      })
    )
    if (ret.Users && ret.Users.length) {
      list.push(...ret.Users)
    }
  }
  console.log('iamListUsers:', list)
  return list
}

async function iamListAccessKeys(params: { userName: string }): Promise<iam.AccessKeyMetadata[]> {
  const { userName } = params
  console.log('iamListAccessKeys:', JSON.stringify(params, null, 2))
  const list = []
  let ret = await iamClient.send(
    new iam.ListAccessKeysCommand({
      UserName: userName,
      MaxItems: 1000,
    })
  )
  if (ret.AccessKeyMetadata && ret.AccessKeyMetadata.length) {
    list.push(...ret.AccessKeyMetadata)
  }
  while (ret.IsTruncated) {
    ret = await iamClient.send(
      new iam.ListAccessKeysCommand({
        UserName: userName,
        MaxItems: 1000,
        Marker: ret.Marker,
      })
    )
    if (ret.AccessKeyMetadata && ret.AccessKeyMetadata.length) {
      list.push(...ret.AccessKeyMetadata)
    }
  }
  console.log('iamListAccessKeys:', list)
  return list
}

async function iamDeleteAccessKey(params: {
  userName: string
  accessKeyId: string
}): Promise<iam.DeleteAccessKeyCommandOutput> {
  const { userName, accessKeyId } = params
  console.log('iamDeleteAccessKey:', JSON.stringify(params, null, 2))
  const ret = await iamClient.send(
    new iam.DeleteAccessKeyCommand({
      UserName: userName,
      AccessKeyId: accessKeyId,
    })
  )
  console.log('iamDeleteAccessKey:', ret)
  return ret
}

async function iamDeactivateAccessKey(params: {
  userName: string
  accessKeyId: string
}): Promise<iam.UpdateAccessKeyCommandOutput> {
  const { userName, accessKeyId } = params
  console.log('iamDeactivateAccessKey:', JSON.stringify(params, null, 2))
  const ret = await iamClient.send(
    new iam.UpdateAccessKeyCommand({
      UserName: userName,
      AccessKeyId: accessKeyId,
      Status: 'Inactive',
    })
  )
  console.log('iamDeactivateAccessKey:', ret)
  return ret
}

export async function handler(event: ScheduledEvent, context: Context): Promise<object> {
  try {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`)
    console.log(`Context: ${JSON.stringify(context, null, 2)}`)
    console.log('REGION', process.env.REGION)

    const users = await iamListUsers()
    for (let i = 0, nUsers = users.length; i < nUsers; i++) {
      const user = users[i]
      console.log('processing user:', user)
      const keys = await iamListAccessKeys({ userName: user.UserName ?? '' })
      for (let k = 0, nKeys = keys.length; k < nKeys; k++) {
        const key = keys[k]
        console.log('processing key:', key)
        if (key.Status === 'Inactive') {
          await iamDeleteAccessKey({
            userName: key.UserName as string,
            accessKeyId: key.AccessKeyId as string,
          })
        } else {
          await iamDeactivateAccessKey({
            userName: key.UserName as string,
            accessKeyId: key.AccessKeyId as string,
          })
        }
      }
    }
    console.log('done')

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

// const testEvent = {
//   version: '0',
//   id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxfff',
//   'detail-type': 'Scheduled Event',
//   source: 'aws.events',
//   account: '012345678901',
//   time: '2023-02-22T15:25:00Z',
//   region: 'us-east-1',
//   resources: [
//     'arn:aws:events:us-east-1:012345678901:rule/CdkBasicsCloudWatchEvents-CloudWatchEventsLambdasc-XXXXXXXXXXXXX',
//   ],
//   detail: {},
// }
// ;(async function () {
//   return await handler(testEvent as ScheduledEvent, {} as Context)
// })()
