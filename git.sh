echo "Getting the prod version ready"
tsc

sleep 1.5

echo "Executing git commit..."
git add .
git commit -m "'$1'"
git push

echo 'U+1F680 Pushed!'