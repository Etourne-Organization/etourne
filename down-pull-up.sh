echo "stopping bot.js"

forever stopall

echo "sleeping 2sec"

sleep 1.5

echo "git pulling"

git pull

echo "sleeping 2sec"

sleep 1.5

echo "starting up bot.js"

forever -o out.log -e err.log ts-node ./src/bot.ts