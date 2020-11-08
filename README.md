# markdown-select

VSCode extension to enhance selection in Markdown documents.

NOTE: As of the October 2020 version of VSCode (1.51) there is built-in support for [Markdown smart select](https://code.visualstudio.com/updates/v1_51#_markdown-smart-select), so this extension is not needed anymore.

Adds a selection provider that reports:

- paragraph selections (delimited by blank lines) and

- hierarchical section selections (defined by Markdown section headings).

Blank lines are empty lines or ones containing only whitespace.

The best way to use this extension is via Visual Studio Code's `Expand Selection` command. The selections reported by this extension will be included with the default ones, such as word and line selections.

E.g., imagine the current editing point is within a word in a paragraph that in turn is in a level 3 section. Expanding the selection will first select the components of the word (if camel-case), and then the whole word. The next expansion will select the whole line. You will then get the paragraph and then the level 3 section. Another expansion will give you the enclosing level 2 section, then one more will give you the top-level level 1 section.
