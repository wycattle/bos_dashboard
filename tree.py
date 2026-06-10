"""
tree.py  —  print a project directory tree
Usage:  python tree.py [root_dir]
        root_dir defaults to current directory
"""
import os
import sys

# ── Edit these to taste ──────────────────────────────────────────────────────
IGNORE = {
    "node_modules", ".git", ".next", "__pycache__",
    ".mypy_cache", ".pytest_cache",
    "dist", "build", ".turbo",
}
# ─────────────────────────────────────────────────────────────────────────────

def tree(root: str, prefix: str = "") -> None:
    try:
        entries = sorted(os.scandir(root), key=lambda e: (e.is_file(), e.name.lower()))
    except PermissionError:
        return

    entries = [e for e in entries if e.name not in IGNORE]

    for i, entry in enumerate(entries):
        connector = "└── " if i == len(entries) - 1 else "├── "
        print(prefix + connector + entry.name)
        if entry.is_dir():
            extension = "    " if i == len(entries) - 1 else "│   "
            tree(entry.path, prefix + extension)

if __name__ == "__main__":
    root = sys.argv[1] if len(sys.argv) > 1 else "."
    print(os.path.abspath(root))
    tree(root)