import Statistics from './statistics.js';
import Wallet from './wallet.js';
import Draw from './draw.js';
import Result from './result.js';

export default class Game {
    constructor(start) {
        this.stats = new Statistics();
        this.wallet = new Wallet(start);
        document.getElementById('start').addEventListener('click', this.startGame.bind(this));
        this.spanWallet = document.querySelector('.panel span.wallet');
        this.boards = document.querySelectorAll('div.color');
        this.inputBid = document.getElementById('bid');
        this.spanResult = document.querySelector('.result');
        this.spanNumberOfGames = document.querySelector('.number');
        this.spanWin = document.querySelector('.win');
        this.spanLoss = document.querySelector('.loss');
        this.render();
    }

    render(
        colors = ['gray', 'gray', 'gray'],
        money = this.wallet.getWalletValue(),
        result = '',
        stats = [0, 0, 0],
        bid = 0,
        wonMoney = 0,
    ) {
        this.boards.forEach((board, index) => {
            board.style.backgroundColor = colors[index];
        });

        this.spanWallet.textContent = money;
        if (result) result = `Wygrałeś ${wonMoney}$.`;
        else if (!result && result !== '') result = `Przegrałeś ${bid}$.`;
        this.spanResult.textContent = result;
        this.spanNumberOfGames.textContent = stats[0];
        this.spanWin.textContent = stats[1];
        this.spanLoss.textContent = stats[2];
        this.inputBid.value = '';
    }

    startGame() {
        if (this.inputBid.value < 1) return alert('kwota, którą chcesz grać jest za mała');
        const bid = Math.floor(this.inputBid.value);

        if (!this.wallet.checkCanPlay(bid)) {
            return alert('masz za mało środków lub podana została nieprawidłowa wartość');
        }

        this.wallet.changeWallet(bid, '-');

        this.draw = new Draw();
        const colors = this.draw.getDrawResult();
        const win = Result.checkWinner(colors);
        // console.log(win);

        const wonMoney = Result.MoneyWinInGame(win, bid);
        this.wallet.changeWallet(wonMoney);

        this.stats.addGameToStatistics(win, bid);

        this.render(colors, this.wallet.getWalletValue(), win, this.stats.showGameStatistics(), bid, wonMoney);
    }
}
