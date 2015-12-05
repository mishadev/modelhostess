#!/bin/bash

if [ -d /etc/secrets ] && [ "$(ls -A /etc/secrets)" ]
then
  for f in /etc/secrets/*
  do
    varname=`basename $f | tr '[:lower:]' '[:upper:]' | tr '-' '_'`
    content=`cat $f`
    echo "export $varname=$content"
  done
fi
