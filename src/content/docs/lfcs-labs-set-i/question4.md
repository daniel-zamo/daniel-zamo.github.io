---
title: "Question 4"
description: "Environment Variables"
sidebar:
  label: "Q4 - Environment Variables"
  order: 25
---

## Question

There is an existing env variable for user `candidate@terminal`: `VARIABLE1=random-string`, defined in file `.bashrc`. Create a new script under `/opt/course/4/script.sh` which:

1. Defines a new env variable `VARIABLE2` with content `v2`, only available in the script itself
2. Outputs the content of the env variable `VARIABLE2`
3. Defines a new env variable `VARIABLE3` with content `${VARIABLE1}-extended`, available in the script itself and all child processes of the shell as well
4. Outputs the content of the env variable `VARIABLE3`

ℹ️ Do not alter the .bashrc file, everything needs to be done in the script itself

## Answer


