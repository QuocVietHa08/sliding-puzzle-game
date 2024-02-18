export class EntryView {
    entryView: HTMLElement;
    constructor(private startGame: () => void) {
        this.createEntryScreen();
    }

    private createEntryScreen() {
        const entryScreenWrapper = document.createElement('div');
        const entryScreenText = document.createElement('h3');

        entryScreenWrapper.classList.add('entry-screen');
        entryScreenText.textContent = 'Welcome to the game! Click to start.';
        entryScreenWrapper.appendChild(entryScreenText);
        document.body.appendChild(entryScreenWrapper);

        entryScreenText.addEventListener('click', this.startGame);
    }
}
