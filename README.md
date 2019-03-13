# vscode-dhall-lsp-server 

This is a [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) VSCode pluging for the [Dhall](https://dhall-lang.org) programming language.


## Features

* Compiler diagnostics on file save
* Autoformatting

![Screenshot Diagnostics](/images/dhall-diagnostics.gif?raw=true)

* Preview for `dhall-to-json`, `dhall-to-yaml`, `dhall-to-text` and `dhall-to-bash` commands.

![Screenshot dhall-to-json](/images/dhall-to-json.png)

## Requirements

Dhall LSP server from the [Dhall Haskell](https://github.com/dhall-lang/dhall-haskell) repo should be installed.

## Limitations
This extension has been tested on Linux (NixOS) and macOS (Sierra).
It might work on Windows but it hasn't been verified.


## Extension Settings

The following settings are available:

* `vscode-dhall-lsp-server.executable`: Absolute path to the dhall-lsp-server executable. If blank the executable is searched on the PATH
* `vscode-dhall-lsp-server.logFile`: mainly interesting to this extension developers.            Absolute path to the log file location. Put `[OUTPUT]` to log to          the VSCode output.

* `vscode-dhall-lsp-server.trace.server`: mainly interesting to this extension developers. If set to `verbose` the VSCode will log LSP communication in it's output panel.

You'll need to reload the window after you change any of this settings.

## Roadmap

* ~~autoformatting~~ (done via lsp server)
* ~~`to-json` and `to-yaml` commands (preview-like)~~
* linting
* file/workspace symbols
* rename support (?) workspace wise (?)
* goto definition
* definition/documentation on hover
* symbol references
* highlight occurrences
* multi-workspace support (?)
* code completion (?)
* snippets
* provide import errors source location
* detailed error messages on request
* reload dhall-lsp-server on settings change
* caching of imports to improve compilation time
* function signatures (?)
* add timeout to requests (throttling?), cancellation of requests

