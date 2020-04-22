import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../../interfaces/IControllerBase.interface'
import ICallbackInput from '../../interfaces/ICallbackInput.interface'
import IScreenshot from '../../interfaces/IScreenShot.interface'
import * as EnvironmentVariables from 'dotenv';
import { WebClient } from '@slack/web-api'

EnvironmentVariables.config({
  path: '.env'
});


class CallbackController implements IControllerBase {
  public path = '/callback'
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.post(this.path + '/', this.screenshotCallback)
  }

  screenshotCallback = async (req: Request, res: Response) => {
    const callbackInput: ICallbackInput = req.body
    callbackInput.screenshots.forEach(async screenShot => {
      let result: any = await this.postToSlack(screenShot);
      console.log(
        `A message was posted to conversation ${result.channel} with id ${result.ts}`
      );
    });
    res.status(200).send();
  }

  postToSlack = async (screenshot: IScreenshot) => {
    const token = process.env.SLACK_TOKEN;
    const web = new WebClient(token);
    const conversationId = process.env.SLACK_CHANNEL;

    return await web.chat.postMessage({
      channel: conversationId,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "*Here's your generated screenshot*"
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Browser:*\n' + screenshot.browser
            },
            {
              type: 'mrkdwn',
              text: '*Version:*\n' + screenshot.browser_version
            },
            {
              type: 'mrkdwn',
              text: '*OS:*\n' + screenshot.os
            },
            {
              type: 'mrkdwn',
              text: '*Version:*\n' + screenshot.os_version
            },
            {
              type: 'mrkdwn',
              text: '*Url:*\n' + screenshot.url
            },
            {
              type: 'mrkdwn',
              text: '*Created:*\n' + screenshot.created_at
            }
          ]
        },
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: screenshot.id,
            emoji: true
          },
          image_url: screenshot.image_url,
          alt_text: 'screenshot'
        }
      ]
    } as any);

  }

}

export default CallbackController