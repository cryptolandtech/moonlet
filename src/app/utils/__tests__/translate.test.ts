jest.mock('../../translations/en');

import { loadTranslations, translate } from '../translate';
import { translation as enTranslations } from '../../translations/en';

describe('utils/translate', () => {
    let translation;
    beforeEach(async () => {
        translation = await loadTranslations('en');
    });

    it('should load translations', async () => {
        expect(translation).toEqual(enTranslations);
    });

    it('should translate texts correctly', async () => {
        // simple translations
        expect(translate('Comp.simple')).toEqual('text');
        expect(translate('Comp.simple', {}, 1)).toEqual('text');

        // translation with params
        expect(translate('Comp.withParams')).toEqual('text {{param1}} {{param2}}');
        expect(translate('Comp.withParams', { param1: 'value1', param2: 'value2' })).toEqual(
            'text value1 value2'
        );

        // nonexistent key
        expect(translate('Comp.nonexistent')).toEqual(undefined);

        // plurals
        translation.plural = jest.fn().mockReturnValueOnce('zero');
        expect(translate('Comp.withPlurals', {}, 0)).toEqual('zero');

        translation.plural = jest.fn().mockReturnValueOnce('one');
        expect(translate('Comp.withPlurals', {}, 0)).toEqual('one');

        translation.plural = jest.fn().mockReturnValueOnce('two');
        expect(translate('Comp.withPlurals', {}, 0)).toEqual('two');

        translation.plural = jest.fn().mockReturnValueOnce('few');
        expect(translate('Comp.withPlurals', {}, 0)).toEqual('few');

        translation.plural = jest.fn().mockReturnValueOnce('many');
        expect(translate('Comp.withPlurals', {}, 0)).toEqual('many');

        translation.plural = jest.fn().mockReturnValueOnce('other');
        expect(translate('Comp.withPlurals', {}, 0)).toEqual('other');
    });
});
