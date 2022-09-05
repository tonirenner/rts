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
import GameLoop from './src/loop.js';
import {Synthesizer} from './src/audio.js';

const debug = document.querySelector('.app > .debug');

const formation   = new Formations.SquareFormation;
const canvas      = new GraphicsDevice.Canvas(document.querySelector('.app > canvas'));
canvas.width      = 1024;
canvas.height     = 768;
canvas.clearColor = 'rgb(28,26,26)';

const synthesizer = new Synthesizer();
const universe    = new Universe(canvas);
const camera      = new Camera(universe);
universe.player   = new Player(universe);

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
planet.position.y = -300;
universe.entities.add(star);
universe.entities.add(planet);

universe.debug = false;

canvas.resize();

const gameLoop    = new GameLoop();
gameLoop.onUpdate = () => universe.update();
gameLoop.onDraw   = () => {
    canvas.save();
    canvas.clear();
    camera.transform();
    universe.render();
    canvas.restore();
};
gameLoop.onStats  = () => {

    debug.innerText = `
    scale: ${universe.origin.scale}
    mouse: ${JSON.stringify(camera.screenToWorld(universe.origin.currentPointerLocation))}
    offset: ${JSON.stringify(universe.origin.offset)}
    fps: ${Math.round(gameLoop.fps)}
    `;
};

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
    e.preventDefault();

    const worldCoordinates = camera.screenToWorld(camera.screenCoordinates(e));

    const unit = universe.player.units.findOneByCoordinates(worldCoordinates);
    if (unit) {
        unit.isSelected = true;
        universe.player.selectedUnits.add(unit);
        console.log('units selected');
        return;
    }

    if (universe.player.selectedUnits.length === 0) {
        return;
    }

    if (universe.player.selectedUnits.length < 2) {
        universe.dispatchCommand(
            new Commands.MoveCommand(universe.player.selectedUnits.at(0), worldCoordinates)
        );
    } else {
        const destinations = formation.computeDestinations(universe.player.selectedUnits, worldCoordinates);
        for (let i in destinations) {
            universe.dispatchCommand(
                new Commands.MoveCommand(
                    universe.player.selectedUnits.at(i),
                    destinations[i]
                )
            );
        }

    }
    console.log('unit move to position');
    synthesizer.play(Synthesizer.COMMANDS.movingToPosition);
});

canvas.addEventListener('click', e => {
    e.preventDefault();

    const worldCoordinates = camera.screenToWorld(camera.screenCoordinates(e));

    let target;

    target = universe.player.units.findOneByCoordinates(worldCoordinates);
    if (target) {
        return;
    }

    for (let i in universe.players) {
        target = universe.players[i].units.findOneByCoordinates(worldCoordinates);

        if (target) {
            synthesizer.play(Synthesizer.COMMANDS.targetConfirmed);
            universe.dispatchCommand(new Commands.LockOnTargetCommand(universe.player.selectedUnits, target));
            console.log('units lock on target');
            return;
        }
    }
});

gameLoop.start();