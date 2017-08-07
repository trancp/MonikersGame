import { MonikersGamePage } from './app.po';

describe('MonikersGame App', () => {
    let page: MonikersGamePage;

    beforeEach(() => {
        page = new MonikersGamePage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('Welcome to app!');
    });
});
