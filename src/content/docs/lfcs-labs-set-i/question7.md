---
title: "Question 7"
titleLink: "S1-Q7"
description: "Network Packet Filtering"
categories: ["LFCS", "Laboratory", "Linux"]
tags: ["Linux CLI"]
weight: 23
---

## Question

{{< alert color="primary" >}}
Server `data-002` is used for big data and provides internally used apis for various data operations. You're asked to implement network packet filters on interface `eth0` on `data-002`:

1. Port `5000` should be closed
1. Redirect all traffic on port `6000` to local port `6001`
1. Port `6002` should only be accessible from IP `192.168.10.80` (server `data-001`)
1. Block all outgoing traffic to IP `192.168.10.70` (server `app-srv1`)

ℹ️ In case of misconfiguration you can still access the instance using `sudo lxc exec data-002 bash`
{{< /alert >}}