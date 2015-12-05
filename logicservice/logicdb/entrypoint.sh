#!/bin/bash
set -e

eval `/populate_env.sh`

map_uidgid() {
  USERMAP_ORIG_UID=$(id -u ${LOGIC_DB_OWNER})
  USERMAP_ORIG_GID=$(id -g ${LOGIC_DB_OWNER})
  USERMAP_GID=${USERMAP_GID:-${USERMAP_GID:-$USERMAP_ORIG_GID}}
  USERMAP_UID=${USERMAP_UID:-$USERMAP_ORIG_UID}
  if [[ ${USERMAP_UID} != ${USERMAP_ORIG_UID} ]] || [[ ${USERMAP_GID} != ${USERMAP_ORIG_GID} ]]; then
    echo "Mapping UID and GID for ${LOGIC_DB_OWNER}:${LOGIC_DB_OWNER} from ${USERMAP_ORIG_UID}:${USERMAP_ORIG_GID} to ${USERMAP_UID}:${USERMAP_GID}"
    groupmod -g ${USERMAP_GID} ${LOGIC_DB_OWNER}
    sed -ie "s/:${USERMAP_ORIG_UID}:${USERMAP_ORIG_GID}:/:${USERMAP_UID}:${USERMAP_GID}:/" /etc/passwd
  fi
}

create_data_dir() {
  mkdir -p ${LOGIC_DB_DATA_DIR}
  chmod -R 0755 ${LOGIC_DB_DATA_DIR}
  chown -R ${LOGIC_DB_OWNER}:${LOGIC_DB_OWNER} ${LOGIC_DB_DATA_DIR}
}

create_log_dir() {
  mkdir -p ${LOGIC_DB_LOG_DIR}
  chmod -R 0755 ${LOGIC_DB_LOG_DIR}
  chown -R ${LOGIC_DB_OWNER}:${LOGIC_DB_OWNER} ${LOGIC_DB_LOG_DIR}
}

map_uidgid
create_data_dir
create_log_dir

# allow arguments to be passed to mongod
if [[ ${1:0:1} = '-' ]]; then
  EXTRA_ARGS="$@"
  set --
elif [[ ${1} == mongod || ${1} == $(which mongod) ]]; then
  EXTRA_ARGS="${@:2}"
  set --
fi

# default behaviour is to launch mongod
if [[ -z ${1} ]]; then
  echo "Starting mongod..."
  exec start-stop-daemon --start --chuid ${LOGIC_DB_OWNER}:${LOGIC_DB_OWNER} \
    --exec $(which mongod) -- --config /etc/mongod.conf ${EXTRA_ARGS}
else
  exec "$@"
fi
