import { useState, useEffect, useRef } from "react";
import Phaser from "phaser";
import detectEthereumProvider from "@metamask/detect-provider";
import { useSelector, useDispatch } from "react-redux";
import { AUTH_PLAYER, INIT_GAME } from "./constants";
import Boot from "./scenes/Boot.js";
import Preloader from "./scenes/Preloader.js";
import MainMenu from "./scenes/MainMenu.js";
import MainGame from "./scenes/Game.js";

function App() {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);
  const [loaded, setLoaded] = useState(false);
  const ethereum = useRef(null);

  useEffect(() => {
    const eventManager = async () => {
      if (game) {
        ethereum.current = await detectEthereumProvider();
        game.events.on("LOGIN_PLAYER", async (event) => {
          console.log("⛓⛓⛓ Login via Web3 Wallet ⛓⛓⛓");
          const addresses = await ethereum.current.request({
            method: "eth_requestAccounts",
          });
          if (addresses[0])
            dispatch({
              type: AUTH_PLAYER,
              player: { id: addresses[0] },
            });
        });

        game.events.on("AUTH_PLAYER", (event) => {
          console.log("EVENT:", event);
          // check user has signed-in; id exists
          if (!event.player?.id) {
            game.scene.start("Preloader");
          } else {
            game.scene.start("MainMenu");
          }
        });

        game.events.on("GAME_START", (event) => {
          console.log("Game Start: State Updated");
          // TODO: set initial game state
          // * gameId, etc
          // * run cloud function for admin bot to move funcs to  escrow
        });

        game.events.on("GAME_OVER", (event) => {
          console.log("Game Over: State Updated");
        });
      }
    };
    eventManager();
  }, [dispatch, game]);

  if (!loaded) {
    setLoaded(true);
    const config = {
      type: Phaser.AUTO,
      gameTitle: "P2E Bank Panic | Phaser x Metamask",
      parent: "game-container",
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      autoFocus: true,
      fps: {
        target: 60,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
          debug: false,
        },
      },
      backgroundColor: "#282c34",
      scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
      },
      scene: [Boot, Preloader, MainMenu, MainGame],
    };
    // init 2d game (Phaser canvas element)
    if (game === null) {
      // init instance of phaser game as per config
      dispatch({ type: INIT_GAME, game: new Phaser.Game(config) });
    }
  }

  return <></>;
}

export default App;
