# ICMS Frontend

This is the frontend for the ICMS.

## NodeJS and npm

You need to have [NodeJS](https://nodejs.org/) v18.17 and [npm](https://www.npmjs.com/) installed on your system.

It is recommended to use [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (Not recommended because it is not natively supported) for installing NodeJS and npm.

Install NodeJS v18.17 and npm with nvm.

```bash
nvm install v18.17
```

Specify the version to use.

```bash
nvm use v18.17
```

Make sure it is installed correctly.

```bash
node -v  # Should output v18.17.x
npm -v
```

## Lint and Pre-commit

We use husky for pre-commit hooks and eslint for linting.

Simply run `npm install` to install all the dependencies.

```bash
npm install
```

Then run `prepare` script

```bash
npm run prepare
```

## VS Code Settings

You can add a workspace setting to automatically format your code on save using the black formatter.

You need to have the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) VS Code extension installed.

Bring up the command palette with Ctrl+Shift+P(Windows/Linux) / Cmd+Shift+P(Mac) and search for "Preferences: Open Workspace Settings (JSON)".

Then replace the content with the following:

```json
{
  "editor.formatOnSave": true,
  "[javascript][typescript][javascriptreact][typescriptreact][json][css][html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  }
}
```

## Development

To start the development server and enable auto reload, run

```bash
npm run dev
```

To start the server normally, run

```bash
npm start
```

You can visit the frontend website through http://localhost:3000/ by default.
