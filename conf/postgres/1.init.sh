#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 <<-EOSQL
  CREATE SCHEMA IF NOT EXISTS url_shortener;
EOSQL
