import { pascalCase, snakeCase } from "change-case";

export class FullModuleTemplate {
  constructor(
    public projectName: string,
    public moduleName: string,
    public moduleRoute: string = `/${moduleName.toLowerCase()}`,
    public moduleNamePascal: string = pascalCase(moduleName),
    public moduleNameSnake: string = snakeCase(moduleName)
  ) {}

  getPageTemplate(this: FullModuleTemplate) {
    return `import 'package:flutter/material.dart';

import 'package:${this.projectName.toLowerCase()}/core/page_state.dart';
import '${this.moduleNameSnake}_presenter.dart';

class ${this.moduleNamePascal}Page extends StatefulWidget {
    static String route = "/";
    final String title;
    const ${this.moduleNamePascal}Page({
    Key key,
    this.title = "${this.moduleNamePascal}",
    }) : super(key: key);

    @override
    _${this.moduleNamePascal}PageState createState() => _${
      this.moduleNamePascal
    }PageState();
}

class _${this.moduleNamePascal}PageState extends PageState<${
      this.moduleNamePascal
    }Page, ${this.moduleNamePascal}Presenter> {
    @override
    Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
        title: Text(widget.title),
        ),
        body: Column(
        children: <Widget>[],
        ),
    );
    }
}
`;
  }

  getModuleTemplate(this: FullModuleTemplate) {
    return `import 'package:flutter_modular/flutter_modular.dart';

import '${this.moduleNameSnake}_page.dart';
import '${this.moduleNameSnake}_presenter.dart';

class ${this.moduleNamePascal}Module extends ChildModule {
    static String route = "${this.moduleNamePascal}";
    @override
    List<Bind> get binds => [
        Bind((i) => ${this.moduleNamePascal}Presenter()),
        ];

    @override
    List<Router> get routers => [
        Router(${this.moduleNamePascal}Page.route, child: (_, args) => ${this.moduleNamePascal}Page()),
        ];

    static Inject get to => Inject<${this.moduleNamePascal}Module>.of();
}
`;
  }

  getPresenterTemplate(this: FullModuleTemplate) {
    return `import 'package:mobx/mobx.dart';

part '${this.moduleNameSnake}_presenter.g.dart';

class ${this.moduleNamePascal}Presenter = _${this.moduleNamePascal}PresenterBase with _$${this.moduleNamePascal}Presenter;

abstract class _${this.moduleNamePascal}PresenterBase with Store {}
    `;
  }
}
