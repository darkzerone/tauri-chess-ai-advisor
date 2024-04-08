# Description
This app was made to experiment with tauri & the openAI api, it's a simple tool to allow someone to play chess and let openAI advise them on their next move.

# Tauri + React + TypeScript + Vite
This project was build using the above packages

## Updating
To update packages run 
`yarn upgrade @tauri-apps/cli @tauri-apps/api --latest`

Run `cargo upgrade` to upgrade the cargo packages which is provided by [cargo-edit](https://github.com/killercup/cargo-edit)

## Debugging

To debug the webviewer used by Tauri, you can just inspect the console by pressing `Command + option + i`
or `ctrl + shift + i` on Windows, right click inspect element also works :)

To debug the Rust code, you can just use `println("message")` in the rust code and it will appear in the rust console.

If `yarn tauri dev` keeps crashing please use the following `RUST_BACKTRACE=1 tauri dev` this will show a more specific message of what is going wrong in your Rust code

The inspector in webviewer is only enabled in dev builds, if you want to enable it in an actual build, you can run `yarn build -- --debug`




## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
