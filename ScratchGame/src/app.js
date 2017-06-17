/*!
 * App script
*/  
 
(function() {
    /*  ================= Variables ============= */
    const coins = [5, 10, 20, 50, 100, 500, 1000, 5000, 10000, 25000, 50000]; 
    const app = new PIXI.Application(500, 500);
    const stage = app.stage;
    const
        bottomSlotHtml = [
            document.getElementById('slot1'),
            document.getElementById('slot2'),
            document.getElementById('slot3')
        ],
        body = document.getElementById('body'),
        winnerCoins = document.getElementById('winner_coins'),
        resetButton = document.getElementById('reset_button'); 
      

    /*  ================= Actions ============= */
    initApp();  
    setupResources(); 
    PIXI.loader.load(setupStage);

    /*  ================= Methods ============= */
    // Init App : set margin top and left and add to the html container  
    function initApp() {
        document.getElementById('canvas-container').appendChild(app.view);
        app.view.style.marginTop = ((-app.view.offsetHeight / 2) - 100) + 'px';
        app.view.style.marginLeft = (-app.view.offsetHeight / 2) + 'px';
    }
    // Setup resources: Coins, forground, cursor and scratch brushes textures  
    function setupResources() {
        coins.map(coin => PIXI.loader.add("coin_" + coin, "images/coins/" + coin + ".png"));
        PIXI.loader.add("forground", "images/forground.jpg");
        PIXI.loader.add("cursor", "images/handicon.png");
        for (let index = 1; index <= 3; index++) {
            PIXI.loader.add("scratch_brush_" + index, "images/scratchmask" + index + ".png");
        }
    }
    // main method of the application
    function setupStage(loader, resources) {
        /*  ================= Variables ============= */
        const
            cursor = new PIXI.Sprite(resources["cursor"].texture),  
            brushes = [
                new PIXI.Sprite(resources["scratch_brush_1"].texture),
                new PIXI.Sprite(resources["scratch_brush_2"].texture),
                new PIXI.Sprite(resources["scratch_brush_3"].texture)
            ];

        let bg,
            renderTexture,
            renderTextureSprite,
            scratchingLayer,
            slots,
            interactiveRegions,
            slotRevealed,
            dragging = false;
         
         
          
        /*  ================= Actions ============= */
        //Initiate the stage      

        initStage(); 

        makeStageInteractable(); 
        resetButton.addEventListener('click', initStage);

        /*  ================= Methods ============= */
        function initStage() {
            slots = [];
            interactiveRegions = [];
            slotRevealed = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            dragging = false; 
            renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);
            renderTextureSprite = new PIXI.Sprite(renderTexture);
            stage.interactive = true;

            stage.removeChildren();
            setupScratchingLayer();
            setupCanvasBackground();

            stage.addChild(scratchingLayer);
            stage.addChild(bg);
            stage.addChild(renderTextureSprite);
            createSlots(); // create slots, icons and interactive region of each slot.
            stage.addChild(cursor); // append cursor as top child.

            for (let index in bottomSlotHtml) {
                bottomSlotHtml[index].style.backgroundImage = ''; 
            }

            body.className = '';
        }
        function setupScratchingLayer() {
            scratchingLayer = new PIXI.Sprite(resources["forground"].texture);
            scratchingLayer.width = app.screen.width;
            scratchingLayer.height = app.screen.height;
        }
        function setupCanvasBackground() {
            bg = new PIXI.Graphics();
            bg.beginFill(0x66381a);
            bg.drawRect(0, 0, app.screen.width, app.screen.height);
            bg.endFill();
            bg.mask = renderTextureSprite;
        }
        function makeStageInteractable() {
            stage.interactive = true;
            stage.on('pointerdown', (event => { dragging = true; }));
            stage.on('pointerup', (() => dragging = false));
            stage.on('pointermove', pointerMove);
        }
        function pointerMove(event) {  
            let pos = event.data.global;
            // move cursor align with pointer
            cursor.position.copy(pos);
            if (dragging) {
                // to make sure mouse pointer is in center of scrath point
                pos.x -= 50;
                pos.y -= 50;
                // get a random brush and render to texture for revealing the coins.
                let randomBrush = brushes[Math.floor(Math.random() * (brushes.length - 1))];
                randomBrush.position.copy(pos);
                app.renderer.render(randomBrush, renderTexture, false, null, false);

                revealSlots(pos);
            } 
        }
        function revealSlots(pos) {
            //3x3 table for checking revealed slot
            for (let row = 0; row < 3; row++)
                if (pos.y >= 30 + (row * 150) && pos.y <= 120 + (row * 150) )  
                    for (let col = 0; col < 3;col++)
                        if (pos.x >= 150 * col && pos.x <= 100 + (150*col) && dragging && !slotRevealed[(row*3) + col])
                            setBottomSlots(row,col);   
            
        }
        function createSlots() {
            /*  ================= Variables ============= */
            const slotWidth = 100;
            const slotPadding = 50;


            /*  ================= Actions ============= */
            // 3 x 3 grid scratch game.
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    create(row, col);
                }
            }

            /*  ================= Methods ============= */
            function create(row, col) {  // creates slots and interactive region and append to stage.

                stage.addChild(createSlot());
                //stage.addChild(createInteractiveRegion());
                

                function getRandomCoin() {
                    return coins[Math.floor(Math.random() * (coins.length - 1))];
                }
                function createSlot() {
                    const slot = new PIXI.Sprite(resources["coin_" + getRandomCoin()].texture);
                    slot.position.set(
                        slotPadding + (col * (slotWidth + slotPadding)),
                        slotPadding + (row * (slotWidth + slotPadding))
                    );
                    slot.width = slotWidth;
                    slot.height = slotWidth;

                    // this actually make the slot revealable by masking with render texture sprit
                    slot.mask = renderTextureSprite;

                    // Push to slots
                    slots.push(slot);
                    return slot;
                }
                /*
                function createInteractiveRegion() {

                    const interactiveRegion = new PIXI.Graphics(); 
                    const w = slotWidth / 1.5;
                    const h = slotWidth / 1.5;
                    // make sure its transparent
                    interactiveRegion.beginFill(0x000000, .1);
                    interactiveRegion.drawRect(0, 0, w, h);
                    interactiveRegion.endFill();

                    interactiveRegion.position.set(
                        (slotPadding * 1.25) + (col * (slotWidth + slotPadding)),
                        (slotPadding * 2) + (row * (slotWidth + slotPadding))
                    );
                    interactiveRegion.width = w;
                    interactiveRegion.height = h;


                    function interactiveRegionPointerHandler(event) { // on pointer over calls three bottom slots handler.
                        const slotIndex = (row * 3) + col;
                        console.log(slotIndex + ':'+this.slotIndex);
                        if (this.slotIndex && this.slotIndex == slotIndex) {
                            //pointerMove(event);
                            let pos = event.data.global;
                            if (dragging && !slotRevealed[slotIndex]  ) // if this slot is not already revealed 
                                setBottomSlots(slotIndex); 
                        }
                    };
                    interactiveRegion.slotIndex = (row * 3) + col;
                    interactiveRegion.interactive = true; // make sure its interactive able  
                    interactiveRegion.on('pointermove', interactiveRegionPointerHandler); 
                    interactiveRegions.push(interactiveRegion); // Push to interactiveRegion 
                    
                    return interactiveRegion;
                }*/
            }

        } 
        function addToRevealedSlots(row, col, slotIndex, coin) {
            slotRevealed[slotIndex] = parseInt(coin);


            // auto reveal the slot to make sure it completly reveales
            let randomBrush = new PIXI.Sprite(resources["scratch_brush_2"].texture) ; 
               
            randomBrush.x = 75 + (col*150);
            randomBrush.y = 75 + (row * 150);  
            // Listen for animate update
            let delta = 0;
            app.ticker.add(animationTicker, randomBrush);
            function animationTicker() {

                delta += 10;
                randomBrush.width = delta;
                randomBrush.height = delta;
                randomBrush.x -= delta/25;
                randomBrush.y -= delta / 25; 
                app.renderer.render(randomBrush , renderTexture, false, null, false);
                if (delta >= 150) {
                    app.ticker.remove(animationTicker, randomBrush);
                }
            }
        }
        function setBottomSlots(row,col) { 
            /*  ================= Variables ============= */
            const slotIndex = (row * 3) + col,
                slot = slots[slotIndex],
                getCoinByTextureName = slot.texture.baseTexture.imageUrl.replace('images/coins/', '').replace('.png', ''),
                sameRevealedCoinsCount = [];
            let slotsPriorityResult = [];


            /*  ================= Actions ============= */
            addToRevealedSlots(row, col, slotIndex, getCoinByTextureName);

            countRevealedCoins();
            setResultPriority_by_sortRevealedCoins();
            setResultPriority_by_sameCoinsRevealed(2);
            setResultPriority_by_sameCoinsRevealed(3);

            renderBottomSlotsIcon(); 
            checkForGameResult();

            /*  ================= Methods ============= */
            // count number of same revealed coins
            function countRevealedCoins() {
                slotRevealed.map(revealedCoins => {
                    const coinIndex = coins.indexOf(revealedCoins);
                    if (coinIndex === -1)
                        return;
                    if (!sameRevealedCoinsCount[coinIndex])
                        sameRevealedCoinsCount[coinIndex] = 0;
                    sameRevealedCoinsCount[coinIndex]++;
                });
            }

            // sort result based on greater revealed coins
            function setResultPriority_by_sortRevealedCoins() {
                sameRevealedCoinsCount.map((value, key) => {
                    slotsPriorityResult.push(coins[key]);
                });
                slotsPriorityResult.sort(function(a, b) { return b - a });
            }

            // set priority to higher coin which has been revealed multiple times, 2 or 3 
            function setResultPriority_by_sameCoinsRevealed(numberOfSameCoins) {
                const sortBySameCoins = [];
                // push to list if count of revealed coin is equal to function call.
                sameRevealedCoinsCount.map((coinCount, coinKey) => {
                    if (coinCount >= numberOfSameCoins) {
                        sortBySameCoins.push(coins[coinKey]);
                    }
                });

                // if list is not empty , setup the priority result first by sorting desc.
                if (sortBySameCoins.length) {
                    sortBySameCoins.sort(function(a, b) { return b - a });

                    // if requested number is 2, set the 3rd slot to another higher coin in the revealed list
                    if (numberOfSameCoins === 2) {
                        var indexFor3rdItem = slotsPriorityResult.indexOf(sortBySameCoins[0]) === 0 ? 1 : 0;
                        slotsPriorityResult = [sortBySameCoins[0], sortBySameCoins[0], slotsPriorityResult[indexFor3rdItem]];
                    } else {
                        slotsPriorityResult = [sortBySameCoins[0], sortBySameCoins[0], sortBySameCoins[0]];
                    }
                }
            }

            function renderBottomSlotsIcon() {
                slotsPriorityResult.slice(0, 3).map((value, key) => {
                    bottomSlotHtml[key].style.backgroundImage = 'url(images/coins/' + value + '.png)';
                });
            }

            function checkForGameResult() {
                const isAllSlotsRevealed = slotRevealed.indexOf(0) === -1; 
                if (isAllSlotsRevealed) {

                    stage.interactive = false;
                    body.className += ' show-overlay';

                    // if index 0,1 and 2 are the same then we have a winner
                    let winner = slotsPriorityResult[0] === slotsPriorityResult[1] && slotsPriorityResult[1] === slotsPriorityResult[2];
                    if (winner) {
                        body.className += ' winner';
                        winnerCoins.innerHTML = slotsPriorityResult[0].toFixed(0).replace(/./g, function (c, i, a) {
                            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                        });
                    } else {
                        body.className += ' loser'; 
                    }


                }
            } 
        } 

    } 
})();       