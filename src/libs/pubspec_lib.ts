import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

export class PubspecLib {
  private dependencies = {
    dio: "^3.0.9",
    flutter_mobx: "^1.1.0",
    mobx: "^1.1.1",
    flutter_modular: "^1.0.0",
    flutter: { sdk: "flutter" }
  };

  private devDependencies = {
    mockito: "^4.1.1",
    mobx_codegen: "^1.0.3",
    build_runner: "^1.8.0",
    freezed: "^0.10.4",
    flutter_test: { sdk: "flutter" }
  };

  private environement = {
    sdk: ">=2.6.0 <3.0.0"
  };

  private flutter = {
    "uses-material-design": true
  };

  public _projectName?: string;

  // ------------------------------------------------------
  // REFACTOR PATHS
  // ------------------------------------------------------

  private get projectPath(): string {
    return vscode.workspace.workspaceFolders![0].uri.fsPath;
  }

  private get pubspecPath(): string {
    return path.join(this.projectPath, "\\pubspec.yaml");
  }

  startPubspec(this: PubspecLib) {
    let pubspecContents = fs.readFileSync(this.pubspecPath, "utf8");
    let data = yaml.safeLoad(pubspecContents);

    // get project name from pubspec and let it public to use
    // to avoid loading pubspec eachtime we need it
    this._projectName = data.name;

    let newPubspecData = {
      name: data.name,
      description: data.description,
      version: data.version,
      environment: this.environement,
      dependencies: this.dependencies,
      dev_dependencies: this.devDependencies,
      flutter: this.flutter
    };

    let yamlStr = yaml.safeDump(newPubspecData);

    fs.writeFileSync(this.pubspecPath, yamlStr, "utf8");
  }

  private loadProjectName() {
    let pubspecContents = fs.readFileSync(this.pubspecPath, "utf8");
    let data = yaml.safeLoad(pubspecContents);

    // get project name from pubspec and let it public to use
    this._projectName = data.name;
    return data.name;
  }

  get projectName(): string {
    return this._projectName ?? this.loadProjectName();
  }

  getScript(script: string): string {
    let pubspecContents = fs.readFileSync(this.pubspecPath, "utf8");
    let data = yaml.safeLoad(pubspecContents);

    return data.scripts[script];
  }
}
