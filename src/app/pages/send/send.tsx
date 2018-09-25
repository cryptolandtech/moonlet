import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { Button } from 'preact-material-components/Button';

export class SendPage extends Component {
    public render() {
        return (
            <div>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize outlined label="Recipient" />
                        </LayoutGridCell>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize outlined label="Amount" />
                        </LayoutGridCell>

                        <LayoutGridCell cols={4}>
                            <TextareaAutoSize outlined label="Gas Price" />
                        </LayoutGridCell>
                        <LayoutGridCell cols={4}>
                            <TextareaAutoSize outlined label="Gas Limit" />
                        </LayoutGridCell>
                        <LayoutGridCell cols={4} tabletCols={8}>
                            <TextareaAutoSize outlined label="Fee" />
                        </LayoutGridCell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
                <LayoutGrid class="right-text">
                    <Button ripple raised secondary>
                        Confirm
                    </Button>
                </LayoutGrid>
            </div>
        );
    }
}
