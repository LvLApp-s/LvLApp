import sys
from flask import Flask, render_template_string
from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader('templates'))
try:
    template = env.get_template('community.html')
    print("Syntax OK!")
except Exception as e:
    print(f"Jinja Syntax Error: {e}")
