import re
import json


class Node:
    count = 0

    def __init__(self, label, style, week, parent=None, children=None):
        self.id = Node.count + 1
        self.label = label
        self.style = style
        self.week = int(week)
        self.parent = parent
        if children is None:
            children = []
        self.children = children
        Node.count += 1


def read_meta(school_name, course_name):
    Node.count = 0
    f = open("meta/{}_{}.txt".format(school_name, course_name), "r")
    name = ""
    term = ""
    orientation = ""
    start_date = []
    styles = {}
    class_levels = []
    student_levels = []
    nodes = []
    root = Node(label="", style="root", week=0, parent=None, children=nodes)

    parse_mode = None

    cur_node_parent = None
    cur_node_parent_depth = 0

    for line in f.readlines():
        if line.startswith("name:"):
            name = re.search(r"name: ([A-Za-z0-9\-_]+)", line).group(1)
        if line.startswith("term:"):
            term_match = re.search(r"term: ([A-Za-z0-9]+) ([0-9]+)", line)
            term = "{} {}".format(term_match.group(1), term_match.group(2))
        if line.startswith("orientation:"):
            orientation_match = re.search(r"orientation: ([A-Za-z]+) to ([A-Za-z]+)", line)
            orientation = "LR" if orientation_match.group(1) == "left" and orientation_match.group(
                2) == "right" else "RL"
        if line.startswith("start date:"):
            date_match = re.search(r"start date: (\d{4}) (\d{2}) (\d{2})", line)
            start_date.extend([int(date_match.group(1)), int(date_match.group(2)), int(date_match.group(3))])
        if line.startswith("styles:"):
            parse_mode = "STYLE"
            continue
        if line.startswith("class levels:"):
            parse_mode = "CLASS_LEVEL"
            continue
        if line.startswith("student levels:"):
            parse_mode = "STUDENT_LEVEL"
            continue
        if line.startswith("nodes:"):
            parse_mode = "NODE"
            continue
        if line.startswith("end"):
            parse_mode = None

        if parse_mode == "STYLE":
            style_match = re.search(
                r"name: ([A-Za-z0-9]+), shape: ([A-Za-z]+), style: ([A-Za-z]+), fillcolor: #([A-Za-z0-9]+)", line)
            styles[style_match.group(1)] = {
                "shape": style_match.group(2),
                "style": style_match.group(3),
                "fillcolor": "#{}".format(style_match.group(4))
            }
        elif parse_mode == "CLASS_LEVEL":
            level_match = re.search(r"\s*([A-Za-z-_\s]+): #([A-Za-z0-9]+)", line)
            class_levels.append({"name": level_match.group(1), "color": "#{}".format(level_match.group(2))})
        elif parse_mode == "STUDENT_LEVEL":
            level_match = re.search(r"\s*([A-Za-z-_\s]+): #([A-Za-z0-9]+)", line)
            student_levels.append({"name": level_match.group(1), "color": "#{}".format(level_match.group(2))})
        elif parse_mode == "NODE":
            node_match = re.search(r"(\s+)([A-Za-z0-9\-\s]+) \[([A-Za-z0-9]+), Week([0-9]+)]", line)
            root.week = max(root.week, int(node_match.group(4)))
            if len(node_match.group(1)) // 4 == 1:
                cur_node_parent = Node(node_match.group(2), node_match.group(3), node_match.group(4))
                nodes.append(cur_node_parent)
                cur_node_parent_depth = 1
            elif len(node_match.group(1)) // 4 < cur_node_parent_depth:
                cur_node_parent = cur_node_parent.parent
                cur_node_parent_depth -= 1
                cur_node_parent.parent.children.append(
                    Node(node_match.group(2), node_match.group(3), node_match.group(4), cur_node_parent))
            elif len(node_match.group(1)) // 4 == cur_node_parent_depth:
                new_children = Node(node_match.group(2), node_match.group(3), node_match.group(4), cur_node_parent.parent)
                cur_node_parent.parent.children.append(new_children)
                cur_node_parent = new_children
            elif len(node_match.group(1)) // 4 > cur_node_parent_depth:
                new_children = Node(node_match.group(2), node_match.group(3), node_match.group(4), cur_node_parent)
                cur_node_parent.children.append(new_children)
                cur_node_parent = new_children
                cur_node_parent_depth += 1

    f.close()

    root.label = name

    return name, orientation, start_date, term, class_levels, student_levels, styles, root


def to_json(school_name, course_name, term, start_date, class_levels, student_levels, root, render=False):
    def nodes_to_json(node):
        if render or node.children:
            nodes_json = {
                "id": node.id,
                "name": node.label,
                "parent": node.parent.label if node.parent else "null",
                "children": [nodes_to_json(c) for c in node.children],
                "data": {
                    "week": node.week,
                }
            }
        else:
            nodes_json = {
                "id": node.id,
                "name": node.label,
                "parent": node.parent.label if node.parent else "null",
                "data": {
                    "week": node.week,
                }
            }
        return nodes_json

    json_out = {
        "name": course_name,
        "term": term,
        "start date": "{}/{}/{}".format(start_date[1], start_date[2], start_date[0]),
        "class levels": class_levels,
        "student levels": student_levels,
        "count": Node.count,
        "nodes": nodes_to_json(root)
    }

    with open('data/{}_{}.json'.format(school_name, course_name), 'w', encoding='utf-8') as json_out_file:
        json.dump(json_out, json_out_file, indent=4)

def generate_map(school_name, course_name, render=False):
    print("Log: {}_{}".format(school_name, course_name))
    name, orientation, start_date, term, class_levels, student_levels, styles, root = read_meta(school_name, course_name)
    to_json(school_name, course_name, term, start_date, class_levels, student_levels, root, render)
