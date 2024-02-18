import { Board } from '../components/Board';
import { getColumnNumber } from '../utilities/getColumnNumber';
import { getRowNumber } from '../utilities/getRowNumber';
import { PuzzleView } from './PuzzleView';
import JSConfetti from 'js-confetti';

export class BoardView {
    puzzleBox: HTMLElement;
    originalImage: HTMLElement;
    wrapperImage: HTMLElement;
    wrapper = document.querySelector('.wrapper');
    showHelpers: boolean;
    confetti: JSConfetti;
    isSolving: boolean;
    pointBox: HTMLElement;
    point: number;

    constructor(private board: Board, private size: number, private imageSrc: string) {
        this.wrapper = document.querySelector('.wrapper');
        this.confetti = new JSConfetti();
        this.point = 0;
        this.createPointView();
        this.createBoard();
        this.addOriginalImage();
        this.createWrapperImage();
        this.generetePuzzles();
        this.puzzleBox.addEventListener('click', (e) => this.handleUserClick(e));
    }

    setSize(size: number): void {
        this.size = size;
        this.puzzleBox.style.height = `${this.size}px`;
        this.puzzleBox.style.width = `${this.size}px`;

        this.generetePuzzles();
    }

    generetePuzzles(): void {
        this.puzzleBox.innerHTML = '';
        this.board.gameState.forEach((puzzle) => {
            const { x, y, value } = puzzle;

            const imageX = getRowNumber(value - 1, this.board.gridSize);
            const imageY = getColumnNumber(value - 1, this.board.gridSize);

            const puzzleView = new PuzzleView(
                value,
                this.size / this.board.gridSize,
                x,
                y,
                imageX,
                imageY,
                this.imageSrc,
                this.showHelpers
            );

            this.puzzleBox.appendChild(puzzleView.puzzle);
        });
    }

    createBoard(): void {
        this.puzzleBox = document.createElement('div');
        this.puzzleBox.id = 'board';
        this.puzzleBox.style.height = `${this.size}px`;
        this.puzzleBox.style.width = `${this.size}px`;
        this.wrapper.appendChild(this.puzzleBox);
    }

    handleUserClick(event: Event): void {
        if (this.isSolving) return;

        const target = event.target as HTMLElement;
        if (!target.classList.contains('puzzle')) return;
        const index = this.board.gameState.map((el) => el.value).indexOf(+target.dataset.value);

        if (this.board.getPossibleMoves().includes(index)) {
            this.moveElement(this.board.gameState[index].value, 0);
            this.board.makeMove(index);
        }
    }

    moveElement(value1: number, value2: number): void {
        const element1 = this.puzzleBox.querySelector(`[data-value='${value1}'`) as HTMLElement;
        const element2 = this.puzzleBox.querySelector(`[data-value='${value2}'`) as HTMLElement;
        this.point = this.point + 1;

        const tempTop = element1.style.top;
        const tempLeft = element1.style.left;

        element1.style.top = element2.style.top;
        element1.style.left = element2.style.left;

        element2.style.top = tempTop;
        element2.style.left = tempLeft;
        this.updateUserPoint();
    }

    animateSolving(movesIndexes: number[]): void {
        movesIndexes.forEach((moveIndex, i) => {
            setTimeout(() => {
                this.moveElement(this.board.gameState[moveIndex].value, 0);
                this.board.makeMove(moveIndex);
                if (i === movesIndexes.length - 1) {
                    this.confetti.addConfetti({ confettiColors: ['#FFFFFF', '#272727', '#3E3E3E', '#7CA6CB'] });
                    this.isSolving = false;
                }
            }, 150 * i);
        });

        if (movesIndexes.length === 0) this.isSolving = false;
    }
    addOriginalImage(): void {
        this.originalImage = document.createElement('div');
        this.originalImage.id = 'original-image';
        this.originalImage.style.backgroundImage = `url(${this.imageSrc})`;
        this.originalImage.style.height = `${this.size}px`;
        this.originalImage.style.width = `${this.size}px`;
        this.wrapper.appendChild(this.originalImage);
    }
    createWrapperImage(): void {
        this.wrapperImage = document.createElement('div');
        this.wrapperImage.id = 'wrapper-image';
        this.wrapperImage.style.display = 'flex';
        this.wrapperImage.style.justifyContent = 'center';
        this.wrapperImage.style.alignItems = 'center';
        this.wrapperImage.style.gap = '50px';
        this.wrapperImage.style.marginTop = '20px';
        this.wrapperImage.style.marginBottom = '20px';
        this.wrapperImage.appendChild(this.puzzleBox);
        this.wrapperImage.appendChild(this.originalImage);
        this.wrapper.appendChild(this.wrapperImage);
    }
    createPointView(): void {
        this.pointBox = document.createElement('div');
        this.pointBox.id = 'point-box';
        this.pointBox.style.display = 'flex';
        this.pointBox.style.justifyContent = 'center';
        this.pointBox.style.alignItems = 'center';
        this.pointBox.style.color = 'white';
        this.pointBox.innerHTML = `Your current move is: ${this.point?.toString()}`;
        this.wrapper.appendChild(this.pointBox);
    }
    updateUserPoint(): void {
        this.pointBox.innerHTML = `Your current move is: ${this.point?.toString()}`;
    }
    resetPoint(): void {
        this.pointBox.innerHTML = `Your current move is: 0`;
    }
}
