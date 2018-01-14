if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');

var bot_options = {
    debug: true,
    json_file_store: __dirname + '/.data/db/' // store user data in a simple JSON format
};

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.setupWebserver(process.env.port,function(err,webserver) {
});

controller.spawn({
    token: process.env.token
}).startRTM();

var normalizedPath = require("path").join(__dirname, "skills");
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./skills/" + file)(controller);
  });
