import '/styles/App.scss';

import image from '../static/images/image.png';
import avatar from '../static/images/avatar.png';
import { Board } from './components/Board';
import { BoardView } from './views/BoardView';
import { Solver } from './components/Solver';
import { ButtonsView } from './views/ButtonsView';
import { EntryView } from './views/EntryView';

function getBoardWidth(): number {
    return window.innerWidth > 600 ? 500 : window.innerWidth - 40;
}

function startGame() {
    // Remove the entry screen
    const entryScreen = document.querySelector('div.entry-screen');
    if (entryScreen) {
        document.body.removeChild(entryScreen);
    }

    // Start the game
    const boardWidth = getBoardWidth();
    const board = new Board(3);
    const boardView = new BoardView(board, boardWidth, image);
    const solver = new Solver(board);
    new ButtonsView(boardView, solver, board);

    window.addEventListener('resize', () => {
        boardView.setSize(getBoardWidth());
    });
}

window.addEventListener('load', () => new EntryView(startGame));

// const boardWidth = getBoardWidth();

// const board = new Board(3);
// const boardView = new BoardView(board, boardWidth, image);
// const solver = new Solver(board);
// new ButtonsView(boardView, solver, board);

// window.addEventListener('resize', () => {
//     boardView.setSize(getBoardWidth());
// });
