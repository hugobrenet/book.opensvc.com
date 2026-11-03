<!-- llms: The licenses of the third-party components mdBook copies into every page of this book. -->
# Third-party licenses

This book is built with [mdBook](https://github.com/rust-lang/mdBook), which
copies into every page the scripts, styles, fonts and icons of its theme. They
are the work of their authors, and are published here under their licenses.

| Component | Version | Used for | License |
|---|---|---|---|
| [mdBook](https://github.com/rust-lang/mdBook) theme: `book.js`, `searcher.js`, `toc.js`, `css/`, `ayu-highlight.css` | 0.5.4 | page layout, navigation, search | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/) |
| [Font Awesome Free](https://fontawesome.com) | 6.2.0 | the icons of the menu bar | icons: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [highlight.js](https://highlightjs.org) | 10.1.1 | code highlighting | BSD-3-Clause |
| [Tomorrow Night](https://github.com/chriskempson/tomorrow-theme) highlight theme | | code highlighting colors | MIT |
| [Ayu](https://github.com/dempfi/ayu) highlight theme, which mdBook's `ayu-highlight.css` is based on | | code highlighting colors | MIT |
| [clipboard.js](https://clipboardjs.com) | 2.0.4 | the copy button of the code blocks | MIT |
| [elasticlunr.js](http://elasticlunr.com), based on [lunr.js](https://lunrjs.com) | 0.9.5 | search | MIT |
| [mark.js](https://markjs.io) | 8.11.1 | search term highlighting | MIT |
| [Open Sans](https://fonts.google.com/specimen/Open+Sans) | v17 | text font | [Apache-2.0](../fonts/OPEN-SANS-LICENSE.txt) |
| [Source Code Pro](https://github.com/adobe-fonts/source-code-pro) | v11 | code font | [SIL OFL 1.1](../fonts/SOURCE-CODE-PRO-LICENSE.txt) |

The source code of the mdBook theme files is published at
<https://github.com/rust-lang/mdBook>, under the Mozilla Public License 2.0.

The Font Awesome icons are inlined in each page as SVG, each carrying its
attribution: *Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com,
License - https://fontawesome.com/license/free*.

The license texts of the fonts are published beside them, in the `fonts/`
directory of the book.

## highlight.js

```text
BSD 3-Clause License

Copyright (c) 2006, Ivan Sagalaev.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

## MIT licensed components

clipboard.js, Copyright (c) Zeno Rocha.
elasticlunr.js, Copyright (C) 2017 Oliver Nightingale, Copyright (C) 2017 Wei Song.
mark.js, Copyright (c) 2014–2018, Julian Kühnel.
Tomorrow theme, Copyright (c) Chris Kempson.
Ayu theme, Copyright (c) Ike Ku.

Each is published under the MIT license:

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
