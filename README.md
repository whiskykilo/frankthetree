# frankthetree

My wife got a Fiddle Leaf Fig Tree for the living room and wanted to be able to track and alert on it's watering needs. We've been dialing in the moisture levels ever since, but it's become a great way to keep track of our watering schedule.

### Hardware

* (x1) Partile Photon $19.99
* (x1) [DFRobot Moisture Sensor](https://www.amazon.com/DFRobot-Gravity-Capacitive-Corrosion-Resistant/dp/B01GHY0N4K/ref=sr_1_1?ie=UTF8&qid=1498154672&sr=8-1&keywords=dfrobot+moisture) $12.90
* (x1) Misc Project box $4?

### Software

I've been building all of my home automation into Slack, so that's where I started. The Slackbot is built on top of [howdyai/botkit](https://github.com/howdyai/botkit), which is an awesome platform. My bot runs on a Docker host that I have running in my basement.

I have attached the source code for the Particle Photon, the Webhook (to be installed at [particle.io](particle.io)), and the Slackbot. Make sure to update the code with your Slackbot token, Librato token, and any other items I may have missed. I will put together a step by step at some point, but I wanted to get this code out there for others to use.
