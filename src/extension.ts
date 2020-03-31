import * as vscode from "vscode";
import { Core } from "./core";

export function activate(context: vscode.ExtensionContext) {
  let initializeProject = vscode.commands.registerCommand(
    "extension.initializeProject",
    async () => {
      const promptConfirmation: vscode.QuickPickOptions = {
        placeHolder: "Confirm erase all old project data?",
        canPickMany: false
      };

      let option: string | undefined = await vscode.window.showQuickPick(
        ["no", "yes"],
        promptConfirmation
      );

      if (option === "yes") {
        let core = new Core();
        core.initializeProject();
      }
    }
  );

  let createModule = vscode.commands.registerCommand(
    "extension.createModule",
    async (folderUri: vscode.Uri) => {
      let core = new Core();

      let moduleRelativePath = "";
      if (folderUri) {
        console.log(folderUri.fsPath);
        if (folderUri.fsPath.length > core.modulesPath.length) {
          moduleRelativePath =
            folderUri.fsPath.substr(core.modulesPath.length + 1) + "\\";
        }
      } else {
        console.log("No folder selected");
      }
      let valuePlaceholder = `${moduleRelativePath}<<name>>`;
      const options: vscode.InputBoxOptions = {
        prompt: "Module Name",
        value: valuePlaceholder,
        valueSelection: [moduleRelativePath.length, valuePlaceholder.length]
      };
      let modulePath = await vscode.window.showInputBox(options);

      if (modulePath && modulePath.trim() !== "") {
        // remove possible spaces
        modulePath = modulePath.trim();
        // replace slash by back-slash
        modulePath.replace("/", "\\");
        // remove first slash to avoid errors
        if (modulePath.charAt(0) === "\\") {
          modulePath = modulePath.substr(1);
        }
        let splitedPath = modulePath.split("\\");
        // if length > 0, path will be like folder_n\...\module_name
        if (splitedPath.length > 0) {
          // create subfolders if they don't exist
          core.createAllSubDirs(splitedPath);
          let moduleName = splitedPath[splitedPath.length - 1];

          let moduleBasePath = modulePath.substr(
            0,
            modulePath.length - (moduleName.length + 1)
          );

          // Create Module
          core.createModule(
            moduleName,
            `/${moduleName}`,
            `${core.modulesPath}\\${moduleBasePath}`
          );
        }
        // create modules in /modules
        else {
          core.createModule(modulePath);
        }
      }
    }
  );

  context.subscriptions.push(initializeProject);
  context.subscriptions.push(createModule);
}

export function deactivate() {}
