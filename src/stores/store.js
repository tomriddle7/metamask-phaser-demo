import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  INIT_GAME,
  AUTH_PLAYER,
  GET_PLAYER,
  LOGIN_PLAYER,
  GAME_START,
  UPDATE_SCORE,
  GAME_OVER,
} from "../constants";

const initState = {
  game: null,
  gameId: 0,
  player: {},
  score: 0,
  nft: "",
  gameOver: false,
};

// reducer
const reducer = (state = initState, action) => {
  switch (action.type) {
    case INIT_GAME:
      return { ...state, game: action.game };
    case AUTH_PLAYER:
      state.game.events.emit("AUTH_PLAYER", action);
      return { ...state };
    case GET_PLAYER:
      return { ...state, player: action.player };
    case LOGIN_PLAYER:
      state.game.events.emit("LOGIN_PLAYER", "Login player");
      return { ...state, score: action.score };
    // P2E integration: 4. emit event to Phaser scripts
    case GAME_START:
      state.game.events.emit("GAME_START", "Player GAME_START");
      return { ...state, score: action.score, gameOver: false };
    case UPDATE_SCORE:
      return { ...state, score: action.score };
    case GAME_OVER:
      state.game.events.emit("GAME_OVER", "Player GAME_OVER");
      return { ...state, score: action.score, gameOver: true };
    default:
      return state;
  }
}

// redux
export const events = createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
);