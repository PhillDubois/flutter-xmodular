export class AppModuleTemplate {
  getAppWidgetTemplate() {
    return `import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';

import 'app_module.dart';

class AppWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: Modular.navigatorKey,
      title: 'Flutter Project',
      theme: ThemeData(
          primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      onGenerateRoute: Modular.generateRoute,
    );
  }
} 

main() => runApp(ModularApp(module: AppModule()));
    `;
  }

  getAppModuleTemplate() {
    return `import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';

import 'app_presenter.dart';
import 'app_widget.dart';
import 'modules/home/home_module.dart';

class AppModule extends MainModule {
  @override
  List<Bind> get binds => [
        Bind((i) => AppPresenter()),
      ];

  @override
  List<ModularRouter> get routers => [
        ModularRouter(HomeModule.route, module: HomeModule()),
      ];

  @override
  Widget get bootstrap => AppWidget();

  static Inject get to => Inject<AppModule>.of();
}
`;
  }

  getAppPresenterTemplate() {
    return `import 'package:mobx/mobx.dart';
      
part 'app_presenter.g.dart';

class AppPresenter = _AppPresenterBase with _$AppPresenter;

abstract class _AppPresenterBase with Store {}
`;
  }
}
