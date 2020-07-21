import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import { snakeCase, pascalCase } from "change-case";

import { getMainTemplate } from "./templates/main.template";
import { PubspecLib } from "./libs/pubspec_lib";
import { AppModuleTemplate } from "./templates/app_module.template";
import { FullModuleTemplate } from "./templates/full_module.template";
import { CoreTemplate } from "./templates/core.template";
import { getServers } from "dns";

export class Core {
  public pubspecLib = new PubspecLib();
  constructor() {}

  // ┍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┑
  // ┃ Core                                                            ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙

  initializeProject(this: Core) {
    if (this.isValidProject()) {
      try {
        // Wipeout old project
        this.deleteBuildFolder();
        this.deleteLibFolder();

        // create new lib folder
        this.createDir(this.libPath);

        // create new ui folder structure
        this.createDir(this.corePath);

        // create new ui folder structure
        this.createDir(this.uiPath);
        this.createDir(this.modulesPath);

        // create new data folder structure
        this.createDir(this.dataPath);
        this.createDir(this.datasourcesPath);
        this.createDir(this.repositoriesDataPath);
        this.createDir(this.dtosPath);

        // create new domain folder structure
        this.createDir(this.domainPath);
        this.createDir(this.controllersPath);
        this.createDir(this.repositoriesDomainPath);
        this.createDir(this.entitiesPath);

        // Initialized new pubspec
        this.pubspecLib.startPubspec();
        let coreTemplate = new CoreTemplate();
        // Create main
        fs.writeFileSync(
          path.join(this.corePath, "page_state.dart"),
          coreTemplate.getPageStateTemplate()
        );

        // Create main
        fs.writeFileSync(
          path.join(this.libPath, "main.dart"),
          getMainTemplate()
        );

        this.createAppModule();

        // Create Home Module
        this.createModule("home", "/");
      } catch (error) {
        let debug = 0;
      }
    } else {
      vscode.window.showErrorMessage("Invalid project");
    }
  }

  createAppModule(this: Core) {
    // Create App Module
    let appModule = new AppModuleTemplate();
    fs.writeFileSync(
      path.join(this.uiPath, "app_module.dart"),
      appModule.getAppModuleTemplate()
    );
    fs.writeFileSync(
      path.join(this.uiPath, "app_presenter.dart"),
      appModule.getAppPresenterTemplate()
    );
    fs.writeFileSync(
      path.join(this.uiPath, "app_widget.dart"),
      appModule.getAppWidgetTemplate()
    );
  }

  createModule(
    this: Core,
    moduleName: string,
    moduleRoute: string = `/${pascalCase(moduleName)}`,
    moduleBasePath: string = this.modulesPath
  ) {
    let fullModule = new FullModuleTemplate(
      this.pubspecLib.projectName,
      moduleName,
      moduleRoute
    );
    let moduleNameSnakeCase = snakeCase(moduleName);
    let modulePath = path.join(moduleBasePath, moduleNameSnakeCase);
    this.createDir(modulePath);

    fs.writeFileSync(
      path.join(modulePath, `${moduleNameSnakeCase}_module.dart`),
      fullModule.getModuleTemplate()
    );
    fs.writeFileSync(
      path.join(modulePath, `${moduleNameSnakeCase}_presenter.dart`),
      fullModule.getPresenterTemplate()
    );
    fs.writeFileSync(
      path.join(modulePath, `${moduleNameSnakeCase}_page.dart`),
      fullModule.getPageTemplate()
    );
  }

  runScript(this: Core, scriptName: string) {
    let script = this.pubspecLib.getScript(scriptName);
    let terminals = vscode.window.terminals;
    if (terminals.length === 0) {
      let terminal = vscode.window.createTerminal();
      terminal.show();
      terminal.sendText(script);
    } else {
      for (const terminal of terminals) {
        if (terminal.name !== "dart") {
          terminal.show();
          terminal.sendText(script);
        }
      }
    }
  }

  // ┍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┑
  // ┃ Utils                                                           ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙

  isValidProject(this: Core): boolean {
    if (
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length === 1
    ) {
      return fs.existsSync(this.libPath) && fs.existsSync(this.pubspecPath);
    }

    return false;
  }

  deleteBuildFolder(): void {
    try {
      fs.removeSync(this.buildPath);
    } catch (error) {
      let i = 0;
      throw error;
    }
  }

  createDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  createAllSubDirs(subDirs: string[]) {
    let modulePath = this.modulesPath;
    subDirs.forEach((subDir) => {
      modulePath = path.join(modulePath, snakeCase(subDir));
      this.createDir(modulePath);
    });
  }

  deleteLibFolder(): void {
    try {
      fs.removeSync(this.libPath);
    } catch (error) {
      let i = 0;
      throw error;
    }
  }

  // ┍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┑
  // ┃ Paths                                                           ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙

  get projectPath(): string {
    return vscode.workspace.workspaceFolders![0].uri.fsPath;
  }

  get libPath(): string {
    return path.join(this.projectPath, "lib");
  }

  get buildPath(): string {
    return path.join(this.projectPath, "build");
  }

  get pubspecPath(): string {
    return path.join(this.projectPath, "pubspec.yaml");
  }

  get uiPath(): string {
    return path.join(this.libPath, "ui");
  }
  get modulesPath(): string {
    return path.join(this.uiPath, "modules");
  }

  get corePath(): string {
    return path.join(this.libPath, "core");
  }

  get domainPath(): string {
    return path.join(this.libPath, "domain");
  }
  get controllersPath(): string {
    return path.join(this.domainPath, "controllers");
  }
  get repositoriesDomainPath(): string {
    return path.join(this.domainPath, "repositories");
  }
  get entitiesPath(): string {
    return path.join(this.domainPath, "entities");
  }

  get dataPath(): string {
    return path.join(this.libPath, "data");
  }
  get datasourcesPath(): string {
    return path.join(this.dataPath, "datasources");
  }
  get repositoriesDataPath(): string {
    return path.join(this.dataPath, "repositories");
  }
  get dtosPath(): string {
    return path.join(this.dataPath, "dtos");
  }
}
