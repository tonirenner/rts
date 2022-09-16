import {Vec2} from '../coordinates.js';

export class Rectangle
{
    filled = false;
    color  = 'rgb(255,0,0)';

    position  = new Vec2();
    dimension = Vec2.fromScalar(1);
}