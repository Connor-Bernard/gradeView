from flask import Flask, request, render_template
import json
import parser

"""
Dream Team GUI
@Version: DEV
@Copy Right:

    - Parser:
        (C) 2022 University of California, Berkeley - ACE Lab

    - Web GUI - Modifications:
        Copyright 2022 University of California, Berkeley - ACE Lab

        Permission to use, copy, modify, and/or distribute this software for any purpose
        with or without fee is hereby granted, provided that the above copyright notice
        and this permission notice appear in all copies.

        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
        REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
        FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
        INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
        OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
        TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
        THIS SOFTWARE.

    - Web GUI - Interactive d3.js tree diagram
        Copyright 2022 github.com/d3noob

        Permission is hereby granted, free of charge, to any person obtaining a copy of
        this software and associated documentation files (the "Software"), to deal in the
        Software without restriction, including without limitation the rights to use, copy,
        modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
        and to permit persons to whom the Software is furnished to do so, subject to the
        following conditions:

        The above copyright notice and this permission notice shall be included in all copies
        or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
        INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
        FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.

    - Web GUI - D3.js Framework
        Copyright 2010-2021 Mike Bostock

        Permission to use, copy, modify, and/or distribute this software for any purpose
        with or without fee is hereby granted, provided that the above copyright notice
        and this permission notice appear in all copies.

        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
        REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
        FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
        INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
        OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
        TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
        THIS SOFTWARE.
"""

app = Flask(__name__)


@app.route('/', methods=["GET"])
def index():
    course_name = request.args.get("course_name", "CS10")
    start_date = request.args.get("start_date", "2022-01-01")
    student_mastery = request.args.get("student_mastery", "000000")
    show_legend = request.args.get("show_legend", "true").lower() in ["true", "1", "yes"]
    parser.generate_map(name=course_name, student_mastery=student_mastery)
    with open("data/{}.json".format(course_name)) as data_file:
        course_data = json.load(data_file)
    course_term = course_data["term"]
    course_levels = course_data["student levels"]
    course_node_count = course_data["count"]
    course_nodes = course_data["nodes"]
    course_level_colors = [c for n, c in course_levels.items()]
    return render_template("web_ui.html",
                           show_legend=show_legend,
                           start_date=start_date,
                           student_mastery=student_mastery,
                           course_name=course_name,
                           course_term=course_term,
                           course_levels=course_levels,
                           course_level_colors=course_level_colors,
                           course_node_count=course_node_count,
                           course_data=course_nodes)


if __name__ == '__main__':
    app.run()
