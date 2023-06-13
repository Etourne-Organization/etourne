echo "stopping bot.js"

# forever stopall
pm2 stop doppler-run

echo "sleeping 1.5sec"
sleep 1.5

echo "git pulling"
git pull

echo "sleeping 1.5sec"
sleep 1.5

echo "Building prod version"
npm run build

echo "sleeping 1.5sec"
sleep 1.5

echo "starting up bot.js"
# forever -o out.log -e err.log ts-node ./src/bot.ts
pm2 start bin/doppler-run.sh