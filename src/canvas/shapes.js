import {Vec2} from '../math.js';

export class Rectangle
{
    filled = false;
    color  = 'rgb(255,0,0)';

    position  = new Vec2();
    dimension = Vec2.fromScalar(1);
}