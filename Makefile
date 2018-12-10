deploy:
	gcloud beta functions deploy cf-stackdriver-logging-to-slack \
	--runtime=nodejs8 \
	--trigger-topic $$PUBSUB_TPOIC \
	--source=. \
	--set-env-vars SLACK_WEBHOOK_URL=$$SLACK_WEBHOOK_URL \
	--entry-point=subscribe
