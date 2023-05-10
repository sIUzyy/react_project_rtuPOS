# rtu-apparel-pos

# -------------deployment-guide-------------

# since i merged the data of rtu-apparel and rtu-pos, we modify the firebase.json in order to deploy them both in different domain.

# 1. in global file 'npm install -g firebase-tools'
# 2. in global file 'firebase login' make sure to login 'rtustore@gmail.com' account
# 3. in local file 'firebase init' 
# 4. in local file 'change the firebase.json'. 
# in our firebase.json it will show the error page that we created, and we created a 'target' since we have two systems.
# {
#  "hosting": {
#    "target": "tr",
#    "public": "build",
#    "ignore": [
#      "firebase.json",
#      "**/.*",
#      "**/node_modules/**"
#    ],
#    "rewrites": [
#      {
#        "source": "**",
#        "destination": "/index.html"
#      }
#    ]
#  }
# }

# 5. in our terminal 'npm run build'
# in our firebase we have two domain 'rtu-apparel' and 'rtu-pos', since this is 'rtu-pos' we will use 'rtu-pos' in tr.
# 6. after we implement the 'npm run build' now we need to implement the 'firebase target:apply hosting tr rtu-pos'
# 7. 'firebase deploy'
