import {SquareFormation} from './src/game/formations.js';
import {Canvas2D} from './src/canvas/canvas.js';
import Universe from './src/game/universe.js';
import Camera from './src/game/camera.js';
import {Player} from './src/game/player.js';
import {AttackVessel} from './src/game/entities/vessel.js';
import {Turret} from './src/game/entities/turrets.js';
import {LaserTurret} from './src/game/entities/laser.js';
import Star from './src/game/entities/stars.js';
import {Planet} from './src/game/entities/planets.js';
import GameLoop from './src/game/loop.js';
import {LockOnTargetCommand, MoveCommand} from './src/game/command.js';
import {AUDIO_COMMANDS} from './src/game/audio.js';


const debug = document.querySelector('.app > .debug');

const formation   = new SquareFormation();
const canvas      = new Canvas2D(document.querySelector('.app > canvas'));
canvas.width      = 1024;
canvas.height     = 768;
canvas.clearColor = 'rgb(28,26,26)';


const universe  = new Universe(canvas);
universe.camera = new Camera(universe);
universe.player = new Player(universe);

const enemyPlayer = new Player(universe);
enemyPlayer.color = 'rgb(255,0,0)';
universe.players.push(enemyPlayer);

const yourVessel = new AttackVessel(universe.player);
yourVessel.mountTurret(new Turret(universe.player));
yourVessel.mountTurret(new LaserTurret(universe.player));
yourVessel.position.x = 150;
yourVessel.position.y = -225;

const yourVessel2 = new AttackVessel(universe.player);
yourVessel2.mountTurret(new Turret(universe.player));
yourVessel2.mountTurret(new LaserTurret(universe.player));
yourVessel2.position.x = 200;
yourVessel2.position.y = -200;

const enemyVessel = new AttackVessel(enemyPlayer);
enemyVessel.mountTurret(new Turret(enemyPlayer));
enemyVessel.position.x = -200;
enemyVessel.position.y = 200;

universe.player.add(yourVessel);
universe.player.add(yourVessel2);
enemyPlayer.add(enemyVessel);

const star        = new Star(universe.player);
const planet      = new Planet(universe.player);
planet.position.x = 200;
planet.position.y = -300;
universe.add(star);
universe.add(planet);

universe.debug = true;

canvas.resize();

const gameLoop    = new GameLoop();
gameLoop.onUpdate = () => universe.update();
gameLoop.onDraw   = () => {
    universe.render();
};
gameLoop.onStats  = () => {


    debug.innerText = `
    scale: ${universe.camera.origin.scale}
    mouse: ${JSON.stringify(universe.camera.origin.screenPosition)}
    offset: ${JSON.stringify(universe.camera.origin.offset)}
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

    const screenCoordinates = universe.camera.screenCoordinates(e);
    const worldCoordinates  = universe.camera.screenToWorld(screenCoordinates);

    console.log(
        screenCoordinates,
        worldCoordinates,
        universe.camera.worldToScreen(worldCoordinates)
    );
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
        universe.dispatchCommand(new MoveCommand(universe.player.selectedUnits.at(0), worldCoordinates));
    } else {
        const destinations = formation.computeDestinations(universe.player.selectedUnits, worldCoordinates);
        for (let i in destinations) {
            universe.dispatchCommand(new MoveCommand(universe.player.selectedUnits.at(i), destinations[i]));
        }
    }

    let target;

    target = universe.player.units.findOneByCoordinates(worldCoordinates);
    if (target) {
        return;
    }

    for (let i in universe.players) {
        target = universe.players[i].units.findOneByCoordinates(worldCoordinates);

        if (target) {
            universe.dispatchAudio(AUDIO_COMMANDS.TARGET_CONFIRMED);
            universe.dispatchCommand(new LockOnTargetCommand(universe.player.selectedUnits, target));

            console.log('units lock on target');
            return;
        }
    }

    universe.dispatchAudio(AUDIO_COMMANDS.MOVING_TO_POSITION);
});

gameLoop.start();