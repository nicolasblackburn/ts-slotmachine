import 'pixi.js';
import {Application} from './Application';
import { machineDefinition } from './machineDefinition';

PIXI.utils.skipHello();

const app = new Application(machineDefinition);

Object.assign(window, {
    app: app
});