echo "stopping bot.js"

# forever stopall
pm2 stop doppler-run

echo "sleeping 2sec"

sleep 1.5

echo "git pulling"

git pull

echo "sleeping 2sec"

sleep 1.5

echo "starting up bot.js"

# forever -o out.log -e err.log ts-node ./src/bot.ts
pm2 start bin/doppler-run.sh