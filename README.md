# Create CSS Modules

Easily creates matching CSS Modules files for your components

## ✨ Key Features

- One-click creation of CSS Modules files matching your component names
- Automatically inserts the import statement to the top of the file
- Configurable file paths and extensions
- Support for multiple CSS preprocessors

## 💎 Supported File Extensions

- Component files: `js`, `jsx`, `ts`, `tsx`
- Style files: `css`, `scss`, `sass`, `less`, `styl`, `stylus`

## ⌨️ Default Keyboard Shortcuts

| Operating System | Shortcut           |
| ---------------- | ------------------ |
| Windows, Linux   | `Ctrl + Shift + M` |
| Mac              | `Cmd + Shift + M`  |

## ⚙️ Configuration

Customize the extension in your VSCode `settings.json`

```json
{
  "createCSSModules.path": "./styles",
  "createCSSModules.extension": "scss",
  "createCSSModules.autoImport": true,
  "createCSSModules.identifier": "s"
}
```

### Settings Reference

| Option                        | Description                                 | Default  |
| ----------------------------- | ------------------------------------------- | -------- |
| `createCSSModules.path`       | Target directory for CSS Modules files      | `./`     |
| `createCSSModules.extension`  | Preferred CSS file extension                | `css`    |
| `createCSSModules.autoImport` | Enable automatic import statement insertion | `true`   |
| `createCSSModules.identifier` | CSS Modules import identifier               | `styles` |

## 🎥 Demo

See it in action

![Demo Screen](./demo.gif)
