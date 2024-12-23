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

  vscode.window.showInformationMessage('Successfully created CSS Modules file!')
}

// 생성할 파일 유무 체크 함수
const checkFileExists = (filePath: string): boolean => {
  if (fs.existsSync(filePath)) {
    vscode.window.showErrorMessage(`File is already exists in this directory.`)
    return false
  }
  return true
}
