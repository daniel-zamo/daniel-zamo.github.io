## lf-05-pipes.md

- URL: `https://killercoda.com/pawelpiwosz/course/linuxFundamentals/lf-05-pipes`

### Lesson 5: Pipes

```bash
ubuntu:~$ # Practica lf-05-pipes.md
ubuntu:~$ grep 'case' .bashrc 
case "$TERM" in
        # a case would tend to support setf rather than setaf.)
case "$TERM" in
ubuntu:~$ wc -l .bashrc 
102 .bashrc
ubuntu:~$ sort numbers.txt
1
1
..RESUMIDO_INTENSIONALMENTE...
99
99
ubuntu:~$ cat numbers.txt | wc -l
10000
ubuntu:~$ cat numbers.txt | uniq | wc -l
9904
ubuntu:~$ cat numbers.txt | sort | uniq | wc -l
100

# Parte 2. Redirect files
ubuntu:~$ ls -al > directorylist.txt
ubuntu:~$ cat directorylist.txt 
total 148
drwx------  5 root root  4096 Jan 22 12:40 .
drwxr-xr-x 22 root root  4096 Jan 21 14:56 ..
-rw-------  1 root root    10 Feb 10  2025 .bash_history
-rw-r--r--  1 root root  3194 Jan 21 14:56 .bashrc
-rw-r--r--  1 root root    70 Jan 22 12:26 .gitconfig
-rw-------  1 root root    20 Jan 22 12:37 .lesshst
-rw-r--r--  1 root root   161 Apr 22  2024 .profile
drwx------  2 root root  4096 Jan 22 12:27 .ssh
drwxr-xr-x  4 root root  4096 Jan 22 12:05 .theia
-rw-------  1 root root  1192 Jan 22 12:25 .viminfo
-rw-r--r--  1 root root   109 Jan 21 14:56 .vimrc
-rw-r--r--  1 root root   165 Jan 21 14:56 .wget-hsts
-rw-r--r--  1 root root     0 Jan 22 12:40 directorylist.txt
lrwxrwxrwx  1 root root     1 Jan 21 14:56 filesystem -> /
-rw-r--r--  1 root root 29171 Jan 22 12:07 numbers.txt
drwxr-xr-x  2 root root 69632 Jan 22 12:07 testdir
ubuntu:~$ cat .profile > directorylist.txt 
ubuntu:~$ cat directorylist.txt 
# ~/.profile: executed by Bourne-compatible login shells.

if [ "$BASH" ]; then
  if [ -f ~/.bashrc ]; then
    . ~/.bashrc
  fi
fi

mesg n 2> /dev/null || true

ubuntu:~$ echo 'this line is a separator!' >> directorylist.txt
ubuntu:~$ cat directorylist.txt 
# ~/.profile: executed by Bourne-compatible login shells.

if [ "$BASH" ]; then
  if [ -f ~/.bashrc ]; then
    . ~/.bashrc
  fi
fi

mesg n 2> /dev/null || true
this line is a separator!
```

