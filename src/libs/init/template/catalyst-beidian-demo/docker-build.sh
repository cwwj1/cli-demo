#!/usr/bin/env bash

PROJECT=$1

NPM=`which npm`
REDIS_SERVER=`which redis-server`

## 开启redis服务
echo "daemonize yes" >> /etc/redis.conf
${REDIS_SERVER} /etc/redis.conf

## 开启webpack热更新
# ${NPM} run webpack

docker_color_print() {
    declare -A color
    color=(
        ['yellow']='7 30 43'
        ['red']='7 30 41'
        ['blue']='7 30 46'
        ['green']='7 30 42'
    )

    ctype='yellow'
    cwrap='\n'

    [ -n "$2" ] && ctype=$2
    [ "$3" = "0" ] && cwrap=''

    #Style FrontGround BackGround
    SFB=(${color[$ctype]})

    echo -en "\033[${SFB[0]};${SFB[1]};${SFB[2]}m $1 \033[0m$cwrap"
}

docker_init() {
    docker_color_print "|************************************************" "green"
    docker_color_print "|                                                " "green"
    docker_color_print "|               容器正在启动，请稍等..." "green"
    docker_color_print "| 1.重新进入容器 : npm run ssh  " "green"
    docker_color_print "| 2.查看node日志 : pm2 logs" "green"
    docker_color_print "| 3.重启pm2 : npm run pm2:restart" "green"
    docker_color_print "| 4.启动webpack : npm run dev [--project]" "green"
    docker_color_print "|                                                " "green"
    docker_color_print "|************************************************" "green"
    docker_color_print "." "yellow"
    docker_color_print ".." "yellow"
    docker_color_print "..." "yellow"
    docker_color_print "☞ 请输入你想要监听的webpack目录..." "yellow"
    docker_color_print "☞ 比如只监听buy,则输入buy即可。不输入表示监听所有文件" "yellow"
    docker_color_print "☞ 若目前不想绑定，跳过此环节按[CTRL + C]" "yellow"
}

read_command() {
    read -p "$1 : " machine
    echo ${machine};
}

## 绑定webpack目录
webpack_bind() {
    BIND_DIR=$1

    ## 如果没有则绑定所有目录
    if [[ ${BIND_DIR} == "" ]]; then
        BIND_DIR=''
    else
        BIND_DIR="--${BIND_DIR}"
    fi;

    ${NPM} run dev ${BIND_DIR}
}

docker_init

WATCH_DIR=$(read_command '请输入webpack监听的目录名称')
webpack_bind ${WATCH_DIR}