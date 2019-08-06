# vscode-dhall-lsp-server

This is a [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) VSCode plugin for the [Dhall](https://dhall-lang.org) programming language.


## Features

* Compiler diagnostics on file save. Hover over errors to display the error message.

![Diagnostics](/images/diagnostics.apng)

* 'Explain' error messages

![Explain](/images/explain-on-hover.png)


* Formatting.

![Formatting](/images/format.apng)

* Linter diagnostics and linting

![Linting](/images/linting.apng)

* Turn imports into clickable links

![Follow imports](/images/follow-import.apng)

* Display types on hover

![Type hover](/images/type-hover.png)

## Requirements

`dhall-lsp-server` from the [Dhall Haskell](https://github.com/dhall-lang/dhall-haskell) repo should be installed. We also suggest you install the [Dhall Language Support](https://marketplace.visualstudio.com/items?itemName=panaeon.dhall-lang) to enable syntax highlighting for dhall files.

## Limitations
This extension has been tested on Linux (NixOS) and macOS (Sierra).
It might work on Windows but it hasn't been verified.

## Extension Settings

The following settings are available:

* `vscode-dhall-lsp-server.executable`: Absolute path to the dhall-lsp-server executable. If blank the executable is searched on the PATH
* `vscode-dhall-lsp-server.logFile`: mainly interesting to this extension developers.            Absolute path to the log file location. Put `[OUTPUT]` to log to the VSCode output.

* `vscode-dhall-lsp-server.trace.server`: mainly interesting to this extension developers. If set to `verbose` the VSCode will log all LSP communication in it's output panel.

You'll need to reload the window after you change any of this settings.

# Developer instructions

- Check out a copy of the git repository
- Run `npm install` inside the checked-out directory
- Open the directory in VSCode
- In the debug tab press the green 'play' button. Alternatively press F5.
  This opens a new VSCode window with the extension loaded.


## Roadmap

* file/workspace symbols
* rename support (?) workspace wise (?)
* goto definition
* definition/documentation on hover
* symbol references
* multi-workspace support (?)
* code completion (?)
* snippets
* add timeout to requests (throttling?), cancellation of requests

