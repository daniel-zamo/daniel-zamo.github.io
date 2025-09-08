---
title: "Question 6"
titleLink: "S1-Q6"
description: "User, Groups and Sudoers"
categories: ["LFCS", "Laboratory", "Linux"]
tags: ["Linux CLI"]
weight: 21
---

## Question

{{< alert color="primary" >}}
On server `app-srv1`:

1. Change the primary group of user `user1` to `dev` and the home directory to `/home/accounts/user1`
1. Add a new user `user2` with groups `dev` and `op`, home directory `/home/accounts/user2`, terminal `/bin/bash`
1. User `user2` should be able to execute `sudo bash /root/dangerous.sh` without having to enter the `root` password

{{< /alert >}}