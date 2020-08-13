#! /bin/bash

## 预发staging 正式production
DEPLOY_ENV=$1

## 启动pm2服务
./node_modules/.bin/airjs-deploy catalyst_beicang $DEPLOY_ENV

## 健康检查

sleep 10
STATUS=`curl -o /dev/null -s -w %{http_code} http://127.0.0.1/ctl/demo/hello.html`
if [ $STATUS -eq 200 ]; then
    echo 'deployed successed'
    exit 0
else
    echo 'health check failed'
    exit 1
fi
