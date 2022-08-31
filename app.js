import Commands from './src/commands.js';
import Vessels from './src/vessel.js';
import {Player, Universe} from './src/universe.js';
import Turrets from './src/turrets.js';
import GraphicsDevice from './src/graphics.device.js';
import LaserTurret from './src/turrets/laser.js';
import Formations from './src/formations.js';
import Camera from './src/camera.js';
import Stars from './src/stars.js';
import Planets from './src/planets.js';

const debug = document.querySelector('.app > .debug');

const formation   = new Formations.SquareFormation;
const canvas      = new GraphicsDevice.Canvas(document.querySelector('.app > canvas'));
canvas.width      = 1024;
canvas.height     = 768;
canvas.clearColor = 'rgb(28,26,26)';

/*
window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight * 0.85;
    canvas.resize();
});
*/


let refreshTimout = (1000 / 30) | 0;


const universe  = new Universe(canvas);
const camera    = new Camera(universe);
universe.player = new Player(universe);

const enemyPlayer = new Player(universe);
enemyPlayer.color = 'rgb(255,0,0)';
universe.players.push(enemyPlayer);

const yourVessel = new Vessels.AttackVessel(universe.player);
yourVessel.mountTurret(new Turrets.Turret(universe.player));
yourVessel.mountTurret(new LaserTurret(universe.player));
yourVessel.position.x = 150;
yourVessel.position.y = -225;

const yourVessel2 = new Vessels.AttackVessel(universe.player);
yourVessel2.mountTurret(new Turrets.Turret(universe.player));
yourVessel2.mountTurret(new LaserTurret(universe.player));
yourVessel2.position.x = 200;
yourVessel2.position.y = -200;

const enemyVessel = new Vessels.AttackVessel(enemyPlayer);
enemyVessel.mountTurret(new Turrets.Turret(enemyPlayer));
enemyVessel.position.x = -200;
enemyVessel.position.y = 200;

universe.player.units.add(yourVessel);
universe.player.units.add(yourVessel2);
enemyPlayer.units.add(enemyVessel);

const star        = new Stars.Star(universe.player);
const planet      = new Planets.Planet(universe.player);
planet.position.x = 200;
planet.position.y = 300;
universe.entities.add(star);
universe.entities.add(planet);

universe.debug = false;

canvas.resize();

let lastFrameTimestamp = 0;
let delta              = 0;
let updateSteps        = 0;
let fps                = 0;
let framesThisSecond   = 0;
let lastFPSUpdate      = 0;

const fpsCut             = 30;
const fpsMillisecondsCut = 1000 / fpsCut;
const timestep           = 1000 / 60;


requestAnimationFrame(loop);

function draw()
{
    canvas.save();
    canvas.clear();

    camera.transform();
    universe.render();

    canvas.restore();
}


function loop(timestamp)
{
    if (timestamp < lastFrameTimestamp + fpsMillisecondsCut) {
        requestAnimationFrame(loop);
        return;
    }

    if (timestamp > lastFPSUpdate + 1000) {
        fps = 0.25 * framesThisSecond + (1 - 0.25) * fps;

        lastFPSUpdate    = timestamp;
        framesThisSecond = 0;
    }
    framesThisSecond++;

    delta += timestamp - lastFrameTimestamp;
    lastFrameTimestamp = timestamp;

    updateSteps = 0;
    while (delta >= timestep) {
        universe.update();
        delta -= timestep;
        if (updateSteps > 20) {
            console.log('in');
            delta = 0;
            break;
        }
        updateSteps++;
    }

    draw();
    info(universe);
    requestAnimationFrame(loop);
}


/**
 * @param {Universe} universe
 */
function info(universe)
{


    debug.innerText = `
    scale: ${universe.origin.scale}
    mouse: ${JSON.stringify(universe.origin.currentPointerLocation)}
    offset: ${JSON.stringify(universe.origin.offset)}
    fps: ${Math.round(fps)}
    `;
}

document.oncontextmenu = e => {
    e.preventDefault();
};

canvas.addEventListener('mousedown', e => {
    e.preventDefault();

    if (e.which === 3) {
        universe.player.selectedUnits.forEach(unit => {
            unit.isSelected = false;
        });
        universe.player.selectedUnits.clear();
    }

});

canvas.addEventListener('click', e => {
    const screenCoordinates = camera.screenCoordinates(e);
    const worldCoordinates  = camera.screenToWorld(screenCoordinates);

    const unit = universe.player.units.findOneByCoordinates(worldCoordinates);
    if (unit) {
        unit.isSelected = true;
        universe.player.selectedUnits.add(unit);
        console.log('units selected');
        return;
    }

    if (universe.player.selectedUnits.length < 2) {
        universe.dispatchCommand(
            new Commands.MoveCommand(universe.player.selectedUnits.at(0), worldCoordinates)
        );
        console.log('unit move to position');
        return;
    }

    const destinations = formation.computeDestinations(universe.player.selectedUnits, worldCoordinates);
    for (let i in destinations) {
        universe.dispatchCommand(
            new Commands.MoveCommand(
                universe.player.selectedUnits.at(i),
                destinations[i]
            )
        );
    }

    console.log('units move to position');
});

canvas.addEventListener('click', e => {

    const screenCoordinates  = camera.screenCoordinates(e);
    const worldCoordinates   = camera.screenToWorld(screenCoordinates);
    const screenCoordinates2 = camera.worldToScreen(worldCoordinates);
    console.log(screenCoordinates, worldCoordinates, screenCoordinates2);


    let target;

    target = universe.player.units.findOneByCoordinates(worldCoordinates);
    if (target) {
        return;
    }

    for (let i in universe.players) {
        target = universe.players[i].units.findOneByCoordinates(worldCoordinates);

        if (target) {
            universe.dispatchCommand(new Commands.LockOnTargetCommand(universe.player.selectedUnits, target));
            console.log('units lock on target');
            return;
        }
    }
});
