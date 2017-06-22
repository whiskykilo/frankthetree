# Project: frankthetree
# Description: Moisture level sensor that reports to Librato for graphing and then alerts via Slack.
# Author: @whiskykilo
# Date: 6/22/2017

# token= Your slack bot token
# libratouser= Your email address for Librato
# libratotoken= Your Librato API token

FROM bottato/botkit
ENV token=
ENV libratouser=
ENV libratotoken=

COPY . /app

RUN cd /app \
  && npm install --production && npm install node-crontab winston winston-graylog2

WORKDIR /app

CMD ["node", "slack_bot.js"]
