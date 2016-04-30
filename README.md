# LusydBot
A bot for marzavecs lusyd chat  
  
To install this bot you need to download https://github.com/marzavec/HackChat-LusydClient and install it with ```npm install``` 

Open up the www/load.js file and add 
, 'js/bot.js' to the srcArray array.


You can edit the admins array in the bot.js file so it contains your username, and your trip. If you use multiple of the chats you will have to add yourself multiple times with your different trips.

You can add functions to the arrays
* onlineRemove
* onlineAdd
* onlineSet
* mentioned
* info
* warn
* chat
to run whenever those activate.
