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


