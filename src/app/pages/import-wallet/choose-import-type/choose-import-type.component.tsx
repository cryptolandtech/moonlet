import { h, Component } from 'preact';

export enum ImportType {
    MNEMONIC = 'MNEMONIC',
    GOOGLE_DRIVE = 'GOOGLE_DRIVE'
}

interface IProps {
    onSelect: (importType: ImportType) => any;
}

export class ChooseImportType extends Component {
    public render() {
        return <div />;
    }
}
