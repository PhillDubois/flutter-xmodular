export function getMainTemplate() {
  return `import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';

import 'ui/app_module.dart';

void main() => runApp(ModularApp(module: AppModule()));
    `;
}
