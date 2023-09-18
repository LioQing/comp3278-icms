# ICMS Backend

This is the backend for the ICMS.

## Environment Setup

### Python

We use Python 3.11, so make sure you have that installed.

You could use [pyenv](https://github.com/pyenv/pyenv) or [pyenv-win](https://github.com/pyenv-win/pyenv-win) (Windows is not recommended to install pyenv because it does not get native support) to manage your Python versions.

Install Python 3.11 with pyenv.
```bash
pyenv install 3.11
```

Specify Python 3.11 as the version for this directory.
```bash
pyenv local 3.11
```

To check your Python version, run `python --version` in your terminal.
```bash
python --version
```
Or you may need to specify the version explicitly if you didn't use pyenv or have multiple versions installed.
```bash
python3 --version
# or
python3.11 --version
```

### Virtual Environment

It is recommended to use a virtual environment to manage dependencies.

It is highly recommended to use the [venv](https://docs.python.org/3/library/venv.html) module that comes with Python.

To create a virtual environment in the `.venv` directory, run:
```bash
python -m venv .venv
```

Activate the environment.
```bash
# Linux, Bash, Mac OS X
source .venv/bin/activate
# Linux, Fish
source .venv/bin/activate.fish
# Linux, Csh
source .venv/bin/activate.csh
# Linux, PowerShell Core
.venv/bin/Activate.ps1
# Windows, cmd.exe
.venv\Scripts\activate.bat
# Windows, PowerShell
.venv\Scripts\Activate.ps1
```

Install the dependencies.
```bash
pip install -r requirements.txt
```

When you want to deactivate the virtual environment.
```bash
deactivate
```

### Lint and Pre-commit

We use [Flake8](https://flake8.pycqa.org) and [ISort](https://pycqa.github.io/isort/) for the coding style and guidelines. The style is then enforced by [pre-commit](https://pre-commit.com).

Finish the environment setup above (especially installing the dependencies with pip) before using pre-commit.

Install and setup pre-commit.
```bash
pre-commit install
```

To run pre-commit manually (only scans staged files).
```bash
pre-commit run --all-files
```

Remember to stage files again if there are any changes made by the pre-commit hooks or by you.
```bash
git add .
```

### VS Code Settings

You can add a workspace setting to automatically format your code on save using the black formatter.

You need to have the [Black Formatter](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter) VS Code extension installed.

Bring up the command palette with Ctrl+Shift+P(Windows/Linux) / Cmd+Shift+P(Mac) and search for "Preferences: Open Workspace Settings (JSON)".

Then replace the content with the following:
```json
{
    "editor.formatOnSave": true,
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter",
    },
    "black-formatter.args": [
        "--line-length",
        "79",
        "--experimental-string-processing"
    ],
}
```
