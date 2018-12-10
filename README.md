# Cloud Functions for Stackdriver Logging to Slack

Runtime: nodejs8

## Setup

[Export log from Stackdriver Logging to PubSub](https://cloud.google.com/logging/docs/export/configure_export_v2).

[Get Slack incoming Webhook URL](https://api.slack.com/incoming-webhooks).

## Logs

You can find the logs in "Global".

## Deploy

```shell
$ export PUBSUB_TPOIC=<your pubsub topic>
$ export SLACK_WEBHOOK_URL=<your slack incoming webhook url>

$ gcloud beta functions deploy cf-stackdriver-logging-to-slack \
	--runtime=nodejs8 \
	--trigger-topic $PUBSUB_TPOIC \
	--source=. \
	--set-env-vars DATASET=$SLACK_WEBHOOK_URL \
	--entry-point=subscribe
```
