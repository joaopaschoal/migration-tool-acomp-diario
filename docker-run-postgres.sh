#!/bin/bash
docker run --name pg-acomp-diario \
  -e POSTGRES_USER=acompdiario \
  -e POSTGRES_PASSWORD=acompdiario \
  -e POSTGRES_DB=acompdiario \
  -p 5432:5432 \
  -d postgres