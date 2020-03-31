export class CoreTemplate {
  getPageStateTemplate(this: CoreTemplate): string {
    return `import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';

abstract class PageState<TWidget extends StatefulWidget, TBind>
    extends State<TWidget> {
    final presenter = Modular.get<TBind>();

    @override
    void dispose() {
    super.dispose();
    Modular.dispose<TBind>();
    }
}

mixin ModularStateMixin<T extends StatefulWidget, TBind> on State<T> {
    final presenter = Modular.get<TBind>();

    @override
    void dispose() {
    super.dispose();
    Modular.dispose<TBind>();
    }
}
`;
  }
}
