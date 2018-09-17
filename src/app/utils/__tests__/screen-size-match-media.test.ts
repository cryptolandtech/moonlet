import { getScreenSizeMatchMedia } from '../screen-size-match-media';

describe('utils/screen-size-match-media', () => {
    it('should return window match media', () => {
        window.matchMedia = jest.fn();
        getScreenSizeMatchMedia();
        expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 500px)');

        window.matchMedia = jest.fn();
        getScreenSizeMatchMedia('MOCK');
        expect(window.matchMedia).toHaveBeenCalledWith('MOCK');
    });
});
