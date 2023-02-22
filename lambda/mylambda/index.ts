/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Context, ScheduledEvent } from 'aws-lambda'
import AWS from 'aws-sdk'

AWS.config.update({ region: process.env.REGION })
const iam = new AWS.IAM({ apiVersion: '2010-05-08' })
// const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

async function iamListUsers() {
  const list = []
  let ret = await iam
    .listUsers({
      MaxItems: 1000,
    })
    .promise()
  if (ret.Users && ret.Users.length) {
    list.push(...ret.Users)
  }
  while (ret.IsTruncated) {
    ret = await iam
      .listUsers({
        MaxItems: 1000,
        Marker: ret.Marker,
      })
      .promise()
    if (ret.Users && ret.Users.length) {
      list.push(...ret.Users)
    }
  }
  return list
}

async function iamListAccessKeys({ userName }: { userName: string }) {
  console.log('iamListAccessKeys - userName:', userName)
  const list = []
  let ret = await iam
    .listAccessKeys({
      UserName: userName,
      MaxItems: 1000,
    })
    .promise()
  if (ret.AccessKeyMetadata && ret.AccessKeyMetadata.length) {
    list.push(...ret.AccessKeyMetadata)
  }
  while (ret.IsTruncated) {
    ret = await iam
      .listAccessKeys({
        UserName: userName,
        MaxItems: 1000,
        Marker: ret.Marker,
      })
      .promise()
    if (ret.AccessKeyMetadata && ret.AccessKeyMetadata.length) {
      list.push(...ret.AccessKeyMetadata)
    }
  }
  console.log('iamListAccessKeys - list:', list)
  return list
}

async function iamDeleteAccessKey(options: { userName: string; accessKeyId: string }) {
  const { userName, accessKeyId } = options
  console.log('iamDeleteAccessKey - userName:', userName)
  console.log('iamDeleteAccessKey - accessKeyId:', accessKeyId)
  const ret = await iam
    .deleteAccessKey({
      UserName: userName,
      AccessKeyId: accessKeyId,
    })
    .promise()
  console.log('iamDeleteAccessKey - ret:', ret)
  return ret
}

async function iamDeactivateAccessKey(options: { userName: string; accessKeyId: string }) {
  const { userName, accessKeyId } = options
  console.log('iamDeactivateAccessKey - userName:', userName)
  console.log('iamDeactivateAccessKey - accessKeyId:', accessKeyId)
  const ret = await iam
    .updateAccessKey({
      UserName: userName,
      AccessKeyId: accessKeyId,
      Status: 'Inactive',
    })
    .promise()
  console.log('iamDeactivateAccessKey - ret:', ret)
  return ret
}

export async function handler(event: ScheduledEvent, context: Context): Promise<object> {
  try {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`)
    console.log(`Context: ${JSON.stringify(context, null, 2)}`)

    console.log(event)
    console.log('REGION', process.env.REGION)

    const users = await iamListUsers()
    console.log(users)
    for (let i = 0, nUsers = users.length; i < nUsers; i++) {
      const user = users[i]
      console.log('user:', user)
      const keys = await iamListAccessKeys({ userName: user.UserName })
      console.log('keys:', keys)
      for (let k = 0, nKeys = keys.length; k < nKeys; k++) {
        const key = keys[k]
        console.log('key:', key)
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
