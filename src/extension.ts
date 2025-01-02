import * as vscode from 'vscode'
import fs from 'fs'
import path from 'path'

// 확장 기능이 활성화될 때 호출되는 함수
export function activate(context: vscode.ExtensionContext) {
  // 'extension.createCSSModules' 명령어 등록
  const createFileCommand = vscode.commands.registerCommand(
    'extension.createCSSModules',
    () => {
      // 활성화 된 텍스트 에디터가 있는지 확인
      if (vscode.window.activeTextEditor) {
        // 현재 열려있는 파일의 폴더 경로
        const currentDirectory = path.dirname(
          vscode.window.activeTextEditor.document.fileName
        )

        // 현재 열려있는 파일의 이름
        const openedFileName = path.parse(
          vscode.window.activeTextEditor.document.fileName
        ).name

        // 현재 열려있는 파일의 확장자
        const openedFileExtension = path.parse(
          vscode.window.activeTextEditor.document.fileName
        ).ext

        // 파일 확장자 검사 (tsx, jsx, ts, js)
        if (!checkFileExtension(openedFileExtension)) {
          vscode.window.showErrorMessage(
            'Files with this extension are not valid for creating CSS Modules files!'
          )
          return
        }

        // 파일 생성 함수 호출
        createCSSModulesFile(currentDirectory, openedFileName)
      } else {
        // 활성화된 에디터가 없을 때 메시지 표시
        vscode.window.showErrorMessage(
          'No open editor detected to match filename!'
        )
      }
    }
  )

  context.subscriptions.push(createFileCommand)
}

const checkFileExtension = (extension: string): boolean => {
  if (
    extension === '.tsx' ||
    extension === '.jsx' ||
    extension === '.ts' ||
    extension === '.js'
  ) {
    return true
  }
  return false
}

const createCSSModulesFile = (currentDirectory: string, fileName: string) => {
  // VSCode 설정에서 지정한 디렉터리 경로 및 파일 확장자 가져오기
  const config = vscode.workspace.getConfiguration('createCSSModules')
  const settedFilePath = config.get('path', './') // 기본값: 현재 디렉터리
  const settedFileExtension = config.get('extension', 'css') // 기본값: .css

  // 생성할 파일 이름
  const moduleFileName = `${fileName}.module.${settedFileExtension}`

  // 생성할 파일 경로 (현재 파일 경로 + 생성할 파일 경로)
  const createdFileDirectory = path.join(currentDirectory, settedFilePath)

  // 기존 파일 존재 유무 체크
  if (!checkFileExists(path.join(createdFileDirectory, moduleFileName))) {
    return
  }

  // 디렉토리가 없으면 생성
  if (!fs.existsSync(createdFileDirectory)) {
    fs.mkdirSync(createdFileDirectory, { recursive: true })
  }

  fs.writeFile(path.join(createdFileDirectory, moduleFileName), '', err => {
    if (err) {
      return vscode.window.showErrorMessage(
        'Failed to Create CSS Modules file!'
      )
    }
  })

  // 파일 경로 설정
  const importFilePath =
    settedFilePath !== './'
      ? `${settedFilePath}/${moduleFileName}`
      : `./${moduleFileName}`

  insertImport(importFilePath)

  vscode.window.showInformationMessage('Successfully created CSS Modules file!')
}

const insertImport = (filePath: string) => {
  const config = vscode.workspace.getConfiguration('createCSSModules')
  const isAutoImport = config.get('autoImport', true)
  const identifier = config.get('identifier', 'styles')
  const editor = vscode.window.activeTextEditor

  if (!isAutoImport || !editor) {
    return
  }

  const document = editor.document
  const text = document.getText()
  const lines = text.split('\n')

  // 지시문 찾기 ('use strict', 'use server' 등)
  let directiveLineIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].trim().startsWith("'use ") ||
      lines[i].trim().startsWith('"use ')
    ) {
      directiveLineIndex = i
    }
  }

  // import 구문 찾기
  let lastImportLineIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportLineIndex = i
    }
  }

  // 삽입 위치 결정
  let insertPosition: vscode.Position
  if (lastImportLineIndex !== -1) {
    // import 구문이 있는 경우 마지막 import 구문 다음 줄에 삽입
    insertPosition = new vscode.Position(lastImportLineIndex + 1, 0)
  } else if (directiveLineIndex !== -1) {
    // import 구문이 없고 지시문만 있는 경우 두 줄 아래에 삽입
    insertPosition = new vscode.Position(directiveLineIndex + 2, 0)
  } else {
    // 둘 다 없는 경우 파일 최상단에 삽입
    insertPosition = new vscode.Position(0, 0)
  }

  editor.edit(editBuilder => {
    editBuilder.insert(
      insertPosition,
      `import ${identifier} from '${filePath}';\n`
    )
  })
}

// 생성할 파일 유무 체크 함수
const checkFileExists = (filePath: string): boolean => {
  if (fs.existsSync(filePath)) {
    vscode.window.showErrorMessage(`File is already exists in this directory.`)
    return false
  }
  return true
}
