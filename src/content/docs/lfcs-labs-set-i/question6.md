---
title: "Question 6"
description: "User, Groups and Sudoers"
sidebar:
  label: "Q6 - User, Groups and Sudoers"
  order: 35
---

## Question

On server `app-srv1`:

1. Change the primary group of user `user1` to `dev` and the home directory to `/home/accounts/user1`
2. Add a new user `user2` with groups `dev` and `op`, home directory `/home/accounts/user2`, terminal `/bin/bash`
3. User `user2` should be able to execute `sudo bash /root/dangerous.sh` without having to enter the `root` password

