const IncomingWebhook = require('@slack/client').IncomingWebhook;
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

// subscribe is the main function called by Cloud Functions.
module.exports.subscribe = (event, callback) => {
  const logEntry = eventToLogEntry(event.data);

  // Send message to Slack.
  const message = createSlackMessage(logEntry);
  webhook.send(message, callback);
};

/** Sample json payload
logEntry: {
  "insertId":"1trlhygfca7ewn",
  "jsonPayload":{
    "code":591,
    "message":"I got hurt!!!"
  },
  "logName":"projects/<PROJECT_ID>/logs/my-test-log",
  "receiveTimestamp":"2018-12-07T06:46:02.347807181Z",
  "resource":{
    "labels":{
      "project_id":"<PROJECT_ID>"
    },
    "type":"global"
  },
  "severity":"ERROR",
  "timestamp":"2018-12-07T06:46:02.347807181Z"
}
**/
const eventToLogEntry = (data) => {
  return JSON.parse(new Buffer(data, 'base64').toString());
}

const titleLink = (logEntry) => {
  const projectID = logEntry.resource.labels.project_id;
  const insertID = logEntry.insertId;
  return `https://console.cloud.google.com/logs/viewer?project=${projectID}&advancedFilter=insertId="${insertID}"`
}

const formatPayload = (logEntry) => {
  var fields = [];
  if (undefined === logEntry['textPayload']) {
    const keys = Object.keys(logEntry.jsonPayload).sort();

    keys.forEach(function (key) {
      fields.push({
        title: key,
        value: logEntry.jsonPayload[key]
      });
    });
  }
  else {
    fields.push({
      title: "Message",
      value: logEntry['textPayload']
    });
  }

  return fields
}

// createSlackMessage create a message from a build object.
const createSlackMessage = (logEntry) => {
  const projectID = logEntry.resource.labels.project_id;

  let message = {
    text: `Error occur in Project ID: ${projectID}`,
    mrkdwn: true,
    attachments: [
      {
        title: 'Error logs',
        title_link: titleLink(logEntry),
        color: 'danger',
        fields: formatPayload(logEntry),
        footer: "GCP Stackdriver Logging",
        ts: (Date.parse(logEntry.timestamp) / 1000)
      }
    ]
  };
  return message
}
