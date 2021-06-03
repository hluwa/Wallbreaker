# Wallbreaker

🔨 Break Java Reverse Engineering form Memory World!

## WTF?

Wallbreaker is a useful tool to live analyzing Java heap, powered by [frida](https://github.com/frida/frida). Provide
some commands to search object or class from the memory, and beautifully visualize the real structure of the target.

Want to know real data content? list item? map entries? Want to know about implementation of the interface? Try it! What
you see is what you get!

## How to start?

### 1. Install objection

> pip3 install objection

### 2. Download wallbreaker

> mkdir -p ~/.objection/plugins/ \
> git clone https://github.com/hluwa/Wallbreaker ~/.objection/plugins/Wallbreaker

### 3. Loading as objection plugin

> objection -g com.app.name explore -P ~/.objection/plugins

or

> objection -g com.app.name explore \
> plugin load  ~/.objection/plugins/Wallbreaker

### 4. Use wallbreaker command

> plugin wallbreaker objectsearch java.util.HashMap \
> plugin wallbreaker objectdump &lt;object-handle&gt;

## Commands

### Search

<details>

<summary><b> wallbreaker classsearch &lt;type-pattern&gt; </b></summary>

```
[return all matched class]
```

</details>

<details>

<summary><b> wallbreaker objectsearch &lt;instance-class-name&gt;  </b></summary>

```
[return all matched object-handle and toString]
```

</details>

### Dump

<details>

<summary><b> wallbreaker classdump &lt;class-name&gt; [--fullname] </b></summary>

```
[
   pretty print class structure: fields declare, static field value, methods declare.
      set --fullname to display package name of type name.
]
```

</details>

<details>

<summary><b> wallbreaker objectdump &lt;object-handle&gt; [--fullname] [--as-class class-name] </b></summary>

```
[
   pretty print object structure: fields declare and value, methods declare.
      set --fullname to display package name of type name;
      set --as-class to cast instance type(super class, not interface).
   if instance is a collection or map, dump all entries.
]
```

</details>

## Demo

[![asciicast](https://asciinema.org/a/XZf8yLWJylCKJfcaYzcKlNbIy.svg)](https://asciinema.org/a/XZf8yLWJylCKJfcaYzcKlNbIy)
