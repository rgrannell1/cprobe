
# cprobe [![Build Status](https://travis-ci.org/rgrannell1/cprobe.png?branch=master)](https://travis-ci.org/rgrannell1/cprobe)

<img src="cprobe.gif"> </img>

cprobe is a primarily interactive tool for testing connections to provided URLs. Its envisaged uses are to:

- replace manual CURL testing during installation / reconfiguration.
- test and measure network reliability.
- gauge the quality and speed of a public network.

cprobe supports common protocols (http, https, ssh).

### Usage

```
cprobe https://google.com ssh://fake@test.com:24
```

### License

The MIT License

Copyright (c) 2016 Ryan Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Versioning

Versioning complies with the Semantic Versioning 2.0.0 standard.

http://semver.org/
