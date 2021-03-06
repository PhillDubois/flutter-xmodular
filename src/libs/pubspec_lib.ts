import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

export class PubspecLib {
  private dependencies = {
    dio: "^3.0.10",
    flutter_mobx: "^1.0.1",
    mobx: "^1.1.1",
    flutter_modular: "^2.0.0+1",
    flutter: { sdk: "flutter" },
  };

  private devDependencies = {
    mockito: "^4.1.1",
    mobx_codegen: "^1.0.3",
    build_runner: "^1.10.1",
    freezed: "^0.11.6",
    json_serializable: "^3.4.1",
    flutter_test: { sdk: "flutter" },
  };

  private environement = {
    sdk: ">=2.6.0 <3.0.0",
  };

  private flutter = {
    "uses-material-design": true,
  };

  private scripts = {
    build: "flutter pub run build_runner build --delete-conflicting-outputs",
    watch: "flutter pub run build_runner watch --delete-conflicting-outputs",
    run_all: "flutter run -d all",
    run_chrome: "flutter run -d chrome",
  };

  public _projectName?: string;

  // ------------------------------------------------------
  // REFACTOR PATHS
  // ------------------------------------------------------

  private get projectPath(): string {
    return vscode.workspace.workspaceFolders![0].uri.fsPath;
  }

  private get pubspecPath(): string {
    return path.join(this.projectPath, "pubspec.yaml");
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
      flutter: this.flutter,
      scripts: this.scripts,
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

  listScripts(): string[] {
    let pubspecContents = fs.readFileSync(this.pubspecPath, "utf8");
    let data = yaml.safeLoad(pubspecContents);

    if (!data.scripts) {
      return [];
    }

    return Object.keys(data.scripts);
  }
}
