var Bot = {
    prefix: '#',
    commands: [],
    admins: [
        ["MinusGix", "Marshmallow"]
    ],
    glob: {},
    sendMessage: function(text, where) {
        lusydEngine.send({
            cmd: 'chatTo',
            text: text,
            id: where
        });
        return;
    },
    isAdmin: function(nick, trip) {
        for (var i = 0; i < this.admins.length; i++) {
            if (this.admins[i][0].toLowerCase() === nick.toLowerCase()) {
                if (this.admins[i][1] === trip) {
                    return true;
                }
            }
        }
        return false;
    },
    onlineRemove: [],
    onlineAdd: [],
    mentioned: [],
    onlineSet: [],
    info: [],
    warn: [],
    chat: [],
    runAll: function(arr, args) {
        for (var i = 0; i < arr.length; i++) {
            arr[i](args);
        }
    },
    runCommand: function(args, id) {
        var id2 = divIdToChan(id);
        switch (args.cmd) {
            case 'onlineRemove':
                this.runAll(this.onlineRemove, args);
                return;
                break;
            case 'onlineAdd':
                this.runAll(this.onlineAdd, args);
                return;
                break;
            case 'chat':
                if (args.mention) {
                    this.runAll(this.mentioned, args);
                }
                this.runAll(this.chat, args);
                break;
            case 'onlineSet':
                this.runAll(this.onlineSet, args);
                return;
                break;
            case 'info':
                this.runAll(this.info, args);
                return;
                break;
            case 'warn':
                this.runAll(this.warn, args);
                return;
                break;
            default:
                break;
        }
        var args2 = {};
        args2.nick = args.nick;
        args2.trip = args.trip;
        args2.fullText = args.text;
        args2.text = args.text.split(' ');
        args2.prefix = args.text[0];
        args2.time = args.time;
        args2.id = id2;
        args2.admin = args.admin;
        args2.joinText = function() {
            var gennn = '';
            for (var c = 1; c < args2.text.length; c++) {
                gennn += ' ' + args2.text[c];
            }
            return gennn;
        };
        args2.getText = function() {
            var gennn2 = [];
            for (var d = 1; d < args2.text.length; d++) {
                gennn2.push(args2.text[d]);
            }
            return gennn2;
        };
        if (this.isCommand(args2.text[0])) {
            this.getCommand(args2.text[0]).func(args2);
        }
    },
    getCommand: function(name, index) {
        for (var i = 0; i < this.commands.length; i++) {
            if (typeof(this.commands[i].name) === 'string') {
                if ('#' + this.commands[i].name.toLowerCase() === name.replace(/ /g, '_').toLowerCase()) {
                    if (index) {
                        return i;
                    } else {
                        return this.commands[i];
                    }
                }
            } else {
                for (var c = 0; c < this.commands[i].name.length; c++) {
                    if ('#' + this.commands[i].name[c].toLowerCase() === name.replace(/ /g, '_').toLowerCase()) {
                        if (index) {
                            return i;
                        } else {
                            return this.commands[i];
                        }
                    }
                }
            }

        }
    },
    isCommand: function(name) {
        if (typeof(this.getCommand(name)) === 'object') {
            return true;
        }
        return false;
    },
    addCommand: function(name, func, private) {
        this.commands.push({
            name: (function() {
                if (typeof(name) === 'string') {
                    return name.replace(/ /g, '_');
                }
                var gen = [];
                for (var i = 0; i < name.length; i++) {
                    gen.push(name[i].replace(/ /g, '_'))
                }
                return gen;
            })(),
            func: func,
            private: ((!!private) ? true : false)
        });
    },
    removeCommand: function(name) {
        delete(this.getCommand(name));
    },
    changePrefix: function(newPrefix) {
        this.prefix = newPrefix[0];
    }
};


var pushMessage2 = pushMessage,
    pushMessage = function(targetDiv, data) {
        Bot.runCommand(data, targetDiv.id);
        pushMessage2(targetDiv, data);
    };

function divIdToChan(id) {
    for (var i = 0; i < connectedChannels.length; i++) {
        if (connectedChannels[i].chanDiv.id === id) {
            return connectedChannels[i].id;
        }
    }
    return false;
}


////////////////////////////////////////

(function() {
    var b = Bot;
    // private commands :D
    b.addCommand('fuckmeintheass', function(args) {
        b.sendMessage(args.nick + ' gets fucked hard in their ass!', args.id);
    }, true);







    //public commands
    b.addCommand('test', function(args) {
        b.sendMessage('Hello ' + args.nick + '#' + args.trip + '!', args.id);
    });
    b.addCommand(['help', 'commands', 'h'], function(args) {
        var gen = '';
        for (var i = 0; i < b.commands.length; i++) {
            if (b.commands[i].private) continue;
            if (typeof(b.commands[i].name) === 'string') {
                if (i === (b.commands.length - 1)) {
                    gen += b.prefix + b.commands[i].name + '.';
                } else {
                    gen += b.prefix + b.commands[i].name + ', ';
                }
            }else{
                var gen2 = '[';
                for(var k = 0; k < b.commands[i].name.length; k++){
                    if(k === (b.commands[i].name.length-1)){
                        gen2 += b.prefix + b.commands[i].name[k];
                    }else{
                        gen2 += b.prefix + b.commands[i].name[k] + ', ';
                    }
                }
                gen += gen2 + '], ';
            }
        }
        b.sendMessage('Commands: \n' + gen, args.id);
    });


    b.addCommand(['say', 'me'], function(args) {
        b.sendMessage(args.nick + ' said ' + args.joinText(), args.id);
    });


    b.addCommand(['AmIaAdmin', 'amAdmin'], function(args) {
        if (b.isAdmin(args.nick, args.trip)) {
            b.sendMessage('You are an admin, ' + args.nick + '.', args.id);
        } else {
            b.sendMessage('You are not an admin, ' + args.nick + '.', args.id);
        }
    });


    b.glob.afk = [];
    b.chat.push(function(args) {
        for (var i = 0; i < b.glob.afk.length; i++) {
            if (args.nick.toLowerCase() === b.glob.afk[i][0].toLowerCase()) {
                if (args.trip === b.glob.afk[i][1]) {
                    b.sendMessage(args.nick + ' is back from being afk!', args.id);
                    b.glob.afk.splice(i, 1);
                }
            }
        }
    });
    b.addCommand('afk', function(args) {
        b.glob.afk.push([args.nick, args.trip]);
        b.sendMessage(args.nick + ' is now afk.', args.id);
    });



    // things





})();
