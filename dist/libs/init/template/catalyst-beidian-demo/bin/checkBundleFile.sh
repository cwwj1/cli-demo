#!/bin/bash
output=$(git diff --cached --name-only);

if [[ "$output" =~ "dist" ]]
    then
    echo "请不要提交打包后的文件";
    exit 1
fi
