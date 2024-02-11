class Node:
    def __init__(self, name, text, priority, week, style_class):
        self.__name = name
        self.__text = text
        self.__priority = priority
        self.__week = week
        self.__style_class = style_class
        self.__parents = []
        self.__children = []

    def get_name(self):
        return self.__name

    def get_text(self):
        return self.__text

    def get_priority(self):
        return self.__priority

    def get_week(self):
        return self.__week

    def get_style_class(self):
        return self.__style_class

    def get_parents(self):
        return self.__parents

    def get_children(self):
        return self.__children

    def add_parent(self, parent):
        self.__parents.append(parent)

    def add_child(self, child):
        self.__children.append(child)

    def get_parent_count(self):
        return len(self.__parents)

    def has_parent(self, parent):
        return parent in self.__parents

    def has_child(self, child):
        return child in self.__children

    def __str__(self):
        return str(self.__name)