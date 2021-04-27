# Wallbreaker

help to understand java memory world.

## What?

Wallbreaker is a tool based on [Frida](https://frida.re) to help analyze android memory. Now, you can run it
in [objection](https://github.com/sensepost/objection) or interactive python(ipython).

## Features

1. ClassSearch: search class by pattern.
2. ClassDump: quick view class structure.
3. ObjectSearch: search instance by class.
4. ObjectDump: quick view the internal data of an instance.
5. ......

## Usage

### objection

1. clone this repo to your plugins folder, eg:
   > git clone https://github.com/hluwa/Wallbreaker ~/.objection/plugins/Wallbreaker
2. start objection with `-P` or `--plugin-folder` your plugins folder, eg:
   > objection -g com.app.name explore -P ~/.objection/plugins
3. run command:
    1. ` plugin wallbreaker classsearch <pattern>`
    2. ` plugin wallbreaker classdump <classname> [--fullname]`
    3. ` plugin wallbreaker objectsearch <classname>`
    4. ` plugin wallbreaker objectdump <handle> [--fullname]`

#### demo video

[![asciicast](https://asciinema.org/a/XZf8yLWJylCKJfcaYzcKlNbIy.svg)](https://asciinema.org/a/XZf8yLWJylCKJfcaYzcKlNbIy)

### ipython

...
