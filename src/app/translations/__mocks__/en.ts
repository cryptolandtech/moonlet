import { ITranslations } from '../types';

export const translation: ITranslations = {
    texts: {
        Comp: {
            simple: 'text',
            withParams: 'text {{param1}} {{param2}}',
            withPlurals: {
                text: 'other',
                forms: {
                    zero: 'zero',
                    one: 'one',
                    two: 'two',
                    few: 'few',
                    many: 'many'
                }
            }
        }
    },
    plural: jest.fn()
};
