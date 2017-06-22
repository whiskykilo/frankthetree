// whiskykilo
// last updated 5/7/17
// daenerys-bot


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var username = process.env.libratouser;
var token = process.env.libratotoken;

var request = require('request');
var crontab = require('node-crontab');

var logtograylog = 'false'; // options: true/false

if (logtograylog == 'true') {
  var winston = require('winston');
  var WinstonGraylog2 = require('winston-graylog2');
  var options = {
    name: 'Graylog',
    level: 'debug',
    silent: false,
    handleExceptions: false,
    prelog: function(msg) {
      return msg.trim();
    },
    graylog: {
      servers: [{host: '192.168.99.100', port: 12201}],
      hostname: 'Graylog',
      facility: 'frank-bot',
      bufferSize: 1400
    },
    staticMeta: {env: 'staging'}
  };

  var controller = Botkit.slackbot({
    debug: true,
    logger: new winston.Logger({
      levels: winston.config.syslog.levels,
      transports: [
        new(WinstonGraylog2)(options)
      ]
    })
  });
} else {
  var controller = Botkit.slackbot({
      debug: true
  });
};

// let it begin

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

// You will need to update the URL to match your API endpoint
var url = 'https://' + username + ':' + token + '@metrics-api.librato.com/v1/measurements/librato_frankthetree?duration=90&resolution=60';

var daily = crontab.scheduleJob("0 * * * *", function(){
  request({url: url}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var lr = JSON.parse(body);
      var moisturevalue = lr.series[0].measurements[0].value;
      if (moisturevalue > "2600") {
        //Make sure to get your channel number (replace FIXME) and update your user id
        var textNeedDrink = '<@whiskykilo> I could use a drink. Currently my moisture reading is `' + moisturevalue + '`.';
        bot.say({text: textNeedDrink, channel: 'FIXME'});
      } else if (moisturevalue < "2599" && moisturevalue > "2550") {
        var textDrinkSoon = 'I am starting to get thirsty, might want a drink tomorrow. Currently my moisture reading is `' + moisturevalue + '`.';
        bot.say({text: textDrinkSoon, channel: 'FIXME'});
      } else {
        var textNoDrink = 'I am not thirsty right now. Currently my moisture reading is `' + moisturevalue + '`.';
        bot.say({text: textNoDrink, channel: 'FIXME'});
      }
    } else {
      bot.say({text: 'I failed to get a moisture reading. The error message is: ' + error + 'The response code is: ' + response.statusCode, channel: 'FIXME'});
    }
  });
});

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am technically a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '. I am also a Fiddle Leaf tree located in your house.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
