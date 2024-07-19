const player = document.getElementById('player');
const door = document.getElementById('door');
const portal = document.getElementById('portal');
const obstacles = document.querySelectorAll('.obstacle');
const getFuckedBlocks = document.querySelectorAll('.getFucked');
const teleportBlocks = document.querySelectorAll('.teleportBlock');
const mushrooms = document.querySelectorAll('.mushroom');
const movingObstacles = document.querySelectorAll('.movingObstacle');
const movingKnights = document.querySelectorAll('.movingKnight');
let playerPos = { left: 0, bottom: 0 };
let isJumping = false;
let isFalling = false;
let obstacleInterrupt = false;
let shroomsInterrupt = false;
let jumpHeight = 151;
let gravity = 1;
let movingCounter = 0;
let movingCounterKnights = 0;
let playerWidth = 60;

const keys = { a: false, d: false, w: false };  // alle tasten die gebraucht werden

// wenn taste gedrückt wird, wird sie auf high markiert keys[key]
document.addEventListener('keydown', (event) =>
{
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key))
    {
        keys[key] = true;
    }
    if (key === 'w' && !isJumping && !isFalling)
    {
        jump(); // sprung wird ausgeführt bei w taste
    }
});

// wenn taste losgelassen wird, wird sie auf low markiert keys[key]
document.addEventListener('keyup', (event) =>
{
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key))
    {
        keys[key] = false;
    }
});

function jump()
{
    isJumping = true;
    obstacleInterrupt = false;
    let jumpInterval = setInterval(() =>
    {
        obstacleInterrupt = false;
        obstacles.forEach(obstacle =>
        {
            const playerRect = player.getBoundingClientRect();  // position von player auslesen
            const obstacleRect = obstacle.getBoundingClientRect();  // position von obstacles auslesen
            if ((playerRect.top === obstacleRect.bottom) && (playerRect.right > obstacleRect.left) && (playerRect.left < obstacleRect.right)) // wenn objekt im weg ist beim springen
            {
                obstacleInterrupt = true;
            }
        });

        mushrooms.forEach(mushroom =>
        {
            const playerRect = player.getBoundingClientRect();  // position von player auslesen
            const mushroomRect = mushroom.getBoundingClientRect();  // position von mushrooms auslesen
            if ((playerRect.top === mushroomRect.bottom) && (playerRect.right > mushroomRect.left) && (playerRect.left < mushroomRect.right)) // wenn objekt im weg ist beim springen
            {
                obstacleInterrupt = true;
            }
        });

        movingObstacles.forEach(movingObstacle =>
        {
            const playerRect = player.getBoundingClientRect();  // position von player auslesen
            const movingObstacleRect = movingObstacle.getBoundingClientRect();  // position von movingObstacles auslesen
            if ((playerRect.top === movingObstacleRect.bottom) && (playerRect.right > movingObstacleRect.left) && (playerRect.left < movingObstacleRect.right)) // wenn objekt im weg ist beim springen
            {
                obstacleInterrupt = true;
            }
        });

        if (playerPos.bottom >= jumpHeight || obstacleInterrupt === true) // wenn spieler max sprunghöhe erreicht hat oder in hindernis springt
        {
            clearInterval(jumpInterval);    // stoppt das interval
            fall(); // wieder herunterfallen
        }

        if (!(playerPos.bottom >= jumpHeight || obstacleInterrupt === true))
        {
            playerPos.bottom += gravity;    // springt hoch
            updatePlayerPosition(); // aktualisiert spielerposition
        }
    }, 1); // Intervall auf 1 ms gesetzt
    jumpHeight = playerPos.bottom + 151;
}

function shroomjump()
{
    isJumping = true;
    obstacleInterrupt = false;
    let jumpInterval = setInterval(() =>
    {
        obstacleInterrupt = false;
        obstacles.forEach(obstacle =>
        {
            const playerRect = player.getBoundingClientRect();  // position von player auslesen
            const obstacleRect = obstacle.getBoundingClientRect();  // position von obstacles auslesen
            if ((playerRect.top === obstacleRect.bottom) && (playerRect.right > obstacleRect.left) && (playerRect.left < obstacleRect.right)) // wenn objekt im weg ist beim springen
            {
                obstacleInterrupt = true;
            }
        });
        mushrooms.forEach(mushroom =>
        {
            const playerRect = player.getBoundingClientRect();  // position von player auslesen
            const mushroomRect = mushroom.getBoundingClientRect();  // position von mushrooms auslesen
            if ((playerRect.top === mushroomRect.bottom) && (playerRect.right > mushroomRect.left) && (playerRect.left < mushroomRect.right)) // wenn objekt im weg ist beim springen
            {
                obstacleInterrupt = true;
            }
        });
        if (playerPos.bottom >= jumpHeight || obstacleInterrupt === true) // wenn spieler max sprunghöhe erreicht hat oder in hindernis springt
        {
            clearInterval(jumpInterval);    // stoppt das interval
            fall(); // wieder herunterfallen
        }

        if (!(playerPos.bottom >= jumpHeight || obstacleInterrupt === true))
        {
            playerPos.bottom += gravity;    // springt hoch
            updatePlayerPosition(); // aktualisiert spielerposition
        }
    }, 1); // Intervall auf 1 ms gesetzt
    jumpHeight = playerPos.bottom + 301;
}

function fall()
{
    isFalling = true;
    let fallInterval = setInterval(() =>
    {
        obstacleInterrupt = false;
        obstacles.forEach(obstacle =>
        {
            const playerRect = player.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();
            if ((playerRect.bottom === obstacleRect.top) && (playerRect.right > obstacleRect.left) && (playerRect.left < obstacleRect.right))
            {
                obstacleInterrupt = true;
            }
        });

        movingObstacles.forEach(movingObstacle =>
        {
            const playerRect = player.getBoundingClientRect();
            const movingObstacleRect = movingObstacle.getBoundingClientRect();
            if ((playerRect.bottom === movingObstacleRect.top) && (playerRect.right > movingObstacleRect.left) && (playerRect.left < movingObstacleRect.right))
            {
                obstacleInterrupt = true;
            }
        });

        shroomsInterrupt = false;
        mushrooms.forEach(mushroom =>
        {
            const playerRect = player.getBoundingClientRect();
            const mushroomRect = mushroom.getBoundingClientRect();
            if ((playerRect.bottom === mushroomRect.top) && (playerRect.right > mushroomRect.left) && (playerRect.left < mushroomRect.right))
            {
                shroomsInterrupt = true;
            }
        });

        if (playerPos.bottom <= 0 || obstacleInterrupt)
        {
            clearInterval(fallInterval);
            isJumping = false;
            isFalling = false;
        }
        else if (shroomsInterrupt === true) // wenn spieler auf shrooms landet
        {
            clearInterval(fallInterval);
            isFalling = false;
            shroomjump();
        }
        else // wenn spieler noch in der luft ist
        {
            playerPos.bottom -= gravity;
            updatePlayerPosition();
        }
    }, 1);
}

function move()
{
    let newLeft = playerPos.left;

    if (keys.a)
    {
        newLeft = Math.max(0, playerPos.left - 5);
        player.style.transform = 'scaleX(-1)';
    }
    if (keys.d)
    {
        newLeft = Math.min(window.innerWidth - player.offsetWidth, playerPos.left + 5);
        player.style.transform = 'scaleX(1)';
    }

    let canMove = true;

    obstacles.forEach(obstacle =>
    {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Prüfe Kollision für die neue Position nach links
        if (keys.a && playerRect.left - 5 < obstacleRect.right && playerRect.right > obstacleRect.left && playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom)
        {
            canMove = false;
        }

        // Prüfe Kollision für die neue Position nach rechts
        if (keys.d && playerRect.right + 5 > obstacleRect.left && playerRect.left < obstacleRect.right && playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom)
        {
            canMove = false;
        }
    });

    movingObstacles.forEach(movingObstacle =>
    {
        const playerRect = player.getBoundingClientRect();
        const movingObstacleRect = movingObstacle.getBoundingClientRect();

        // Prüfe Kollision für die neue Position nach links
        if (keys.a && playerRect.left - 5 < movingObstacleRect.right && playerRect.right > movingObstacleRect.left && playerRect.bottom > movingObstacleRect.top && playerRect.top < movingObstacleRect.bottom)
        {
            canMove = false;
        }

        // Prüfe Kollision für die neue Position nach rechts
        if (keys.d && playerRect.right + 5 > movingObstacleRect.left && playerRect.left < movingObstacleRect.right && playerRect.bottom > movingObstacleRect.top && playerRect.top < movingObstacleRect.bottom)
        {
            canMove = false;
        }
    });

    mushrooms.forEach(mushroom =>
    {
        const playerRect = player.getBoundingClientRect();
        const mushroomRect = mushroom.getBoundingClientRect();

        // Prüfe Kollision für die neue Position nach links
        if (keys.a && playerRect.left - 5 < mushroomRect.right && playerRect.right > mushroomRect.left && playerRect.bottom > mushroomRect.top && playerRect.top < mushroomRect.bottom)
        {
            canMove = false;
            fallIfNotOnObject();
        }

        // Prüfe Kollision für die neue Position nach rechts
        if (keys.d && playerRect.right + 5 > mushroomRect.left && playerRect.left < mushroomRect.right && playerRect.bottom > mushroomRect.top && playerRect.top < mushroomRect.bottom)
        {
            canMove = false;
            fallIfNotOnObject();
        }
    });

    if (canMove)
    {
        playerPos.left = newLeft;
    }

    updatePlayerPosition();
    checkWinCondition();
    requestAnimationFrame(move);

    // falls man von movingObstacles drabläuft, soll man herunterfallen
    if (!isJumping && !isFalling)
    {
        fallIfNotOnObject();
    }

    // getFuckedBlocks sollen spiel neustarten bei berührung
    getFuckedBlocks.forEach(getFucked => // wenn getFucked block berührt wird
    {
        const playerRect = player.getBoundingClientRect();
        const getFuckedRect = getFucked.getBoundingClientRect();
        if (playerRect.right > getFuckedRect.left && playerRect.left < getFuckedRect.right && playerRect.bottom > getFuckedRect.top && playerRect.top < getFuckedRect.bottom)
        {
            window.location.reload(); // Seite neu laden
        }
    });

    movingKnights.forEach(movingKnight => // wenn getFucked block berührt wird
    {
        const playerRect = player.getBoundingClientRect();
        const movingKnightRect = movingKnight.getBoundingClientRect();
        if (playerRect.right > movingKnightRect.left && playerRect.left < movingKnightRect.right && playerRect.bottom > movingKnightRect.top && playerRect.top < movingKnightRect.bottom)
        {
            window.location.reload(); // Seite neu laden
        }
    });

    // teleportblocks sollen bei berührung den spieler zum endportal bewegen
    teleportBlocks.forEach(teleportBlock =>
    {
        const playerRect = player.getBoundingClientRect();
        const teleportBlockRect = teleportBlock.getBoundingClientRect();
        const portalRect = portal.getBoundingClientRect();

        if (playerRect.right > teleportBlockRect.left && playerRect.left < teleportBlockRect.right && playerRect.bottom > teleportBlockRect.top && playerRect.top < teleportBlockRect.bottom)
        {
            // Spieler wird zum roten Portal teleportiert
            playerPos.left = portalRect.left;
            playerPos.bottom = window.innerHeight - portalRect.bottom;
            updatePlayerPosition(); // aktualisiere die Position des Spielers
        }
    });

    // obstacles bewegen sich
    movingKnights.forEach(movingKnight =>
    {
        const movingKnightsRect = movingKnight.getBoundingClientRect();

        if (movingCounterKnights >= 200)
        {
            movingKnight.style.left = `${movingKnightsRect.left -= 1}px`;
        }
        else if (movingCounterKnights <= 200)
        {
            movingKnight.style.left = `${movingKnightsRect.left += 1}px`;
        }
    });

    if (movingCounterKnights >= 200)
    {
        movingCounterKnights += 1;
    }
    else if (movingCounterKnights <= 200)
    {
        movingCounterKnights += 1;
    }
    if (movingCounterKnights >= 400)
    {
        movingCounterKnights = 0;
    }

    // obstacles bewegen sich
    movingObstacles.forEach(movingObstacle =>
    {
        const movingObstacleRect = movingObstacle.getBoundingClientRect();

        if (movingCounter >= 200)
        {
            movingObstacle.style.left = `${movingObstacleRect.left -= 1}px`;
        }
        else if (movingCounter <= 200)
        {
            movingObstacle.style.left = `${movingObstacleRect.left += 1}px`;
        }
    });

    if (movingCounter >= 200)
    {
        movingCounter += 1;
    }
    else if (movingCounter <= 200)
    {
        movingCounter += 1;
    }
    if (movingCounter >= 400)
    {
        movingCounter = 0;
    }

    // Spieler bewegt sich, wenn er von Obstacles geschoben wird
    movingObstacles.forEach(movingObstacle =>
    {
        const playerRect = player.getBoundingClientRect();
        const movingObstacleRect = movingObstacle.getBoundingClientRect();

        if (playerRect.right >= movingObstacleRect.left && playerRect.left <= movingObstacleRect.right && playerRect.bottom > movingObstacleRect.top && playerRect.top < movingObstacleRect.bottom)
        {
            if (playerRect.right <= movingObstacleRect.right)
            {
                playerPos.left = movingObstacleRect.left - playerWidth;
            }
            else
            {
                playerPos.left = movingObstacleRect.right;
            }
        }
    });
}

function fallIfNotOnObject()
{
    let onObject = false;

    obstacles.forEach(obstacle =>
    {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        if (playerRect.bottom === obstacleRect.top && playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right)
        {
            onObject = true;
        }
    });

    movingObstacles.forEach(movingObstacle =>
    {
        const playerRect = player.getBoundingClientRect();
        const movingObstacleRect = movingObstacle.getBoundingClientRect();
        if (playerRect.bottom === movingObstacleRect.top && playerRect.right > movingObstacleRect.left && playerRect.left < movingObstacleRect.right)
        {
            onObject = true;
        }
    });

    if (!onObject)
    {
        fall();
    }
}

function updatePlayerPosition()
{
    player.style.left = `${playerPos.left}px`;
    player.style.bottom = `${playerPos.bottom}px`;
}

function checkWinCondition()
{
    const playerRect = player.getBoundingClientRect();
    const doorRect = door.getBoundingClientRect();

    if (playerRect.right > doorRect.left && playerRect.left < doorRect.right && playerRect.bottom > doorRect.top && playerRect.top < doorRect.bottom)
    {
        window.location.href = 'index.html'; // Der Link zu der anderen HTML-Seite
    }
}

move();
