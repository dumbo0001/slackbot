var request = require('request');
var xml2js = require('xml2js');
var fs = require('fs');

module.exports = function (controller) {
    controller.webserver.post('/teamcity/incoming', function (req, res) {
        console.log(req.body);

        if (req.body.build && req.body.build.status == "FAILURE"){
            var bot = controller.spawn();
            bot.say("Uh-oh.. Something went wrong with a build");
        }

        res.send('ok');
    });

    controller.hears(['what is the (status of the build|build status)', 'is the build (.+)?(broken|successful|fine)',
        'are there (.+)?problems with the build'],
        'direct_message,direct_mention,mention', function (bot, message) {
            bot.startConversation(message, function (err, convo) {
                var words = [
                    'I\'m going to check it out for you.',
                    '',
                    'Let me check.',
                    'Checking the status on the build server now.'
                ];
                var word = words[Math.floor(Math.random() * words.length)];
                convo.say(`One moment... ${word}`);

                fs.readFile('./examples/buildstatus.xml', function (err, data) {
                    var parser = xml2js.Parser();
                    parser.parseString(data, function (err, result) {
                        if (result.builds.build[0].$.status == 'SUCCESS') {
                            convo.say('The build is fine.');
                        } else {
                            convo.say('The build is broken.');
                            // request("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=building+collapsing&rating=PG-13", function (error, response, body) {
                            //     var data = JSON.parse(body);
                            //     var gifUrl = data.data.fixed_height_downsampled_url;

                            //     convo.say('The build is broken.\n' + gifUrl);
                            // });
                        }
                    });
                });
            });
        });
};