import { h, Component } from 'preact';
import TabBar from 'preact-material-components/TabBar';

import './create-account.scss';
import { Translate } from '../../components/translate/translate.component';
import { bind } from 'bind-decorator';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import Select from 'preact-material-components/Select';
import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';

import CreateAccountTabAdd from './tab-add/tab-add.container';
import CreateAccountTabImport from './tab-import/tab-import.container';
import CreateAccountTabConnect from './tab-connect/tab-connect.container';

interface IState {
    activeTabIndex: number;
    inputs: {
        blockchain: Blockchain;
        accountName: string;
        privateKey: string;
    };
}

export class CreateAccountPage extends Component<{}, IState> {
    private tabBarRef;

    private readonly TABS = [
        {
            titleKey: 'CreateAccountPage.sections.add.title',
            contentComponent: CreateAccountTabAdd
        },
        {
            titleKey: 'CreateAccountPage.sections.connect.title',
            contentComponent: CreateAccountTabConnect
        },
        {
            titleKey: 'CreateAccountPage.sections.import.title',
            contentComponent: CreateAccountTabImport
        }
    ];

    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: 0,
            inputs: {
                blockchain: undefined,
                accountName: '',
                privateKey: ''
            }
        };
    }

    public componentDidMount() {
        this.tabBarRef.MDComponent.listen('MDCTabBar:activated', this.onTabChange);
    }

    public componentWillUnmount() {
        this.tabBarRef.MDComponent.unlisten('MDCTabBar:activated', this.onTabChange);
    }

    @bind
    public onTabChange(e) {
        if (e && e.detail && typeof e.detail.index === 'number') {
            this.setState({
                activeTabIndex: e.detail.index
            });
        }
    }

    public renderAdd() {
        return (
            <div class="tab-content-add">
                <Select
                    hintText="Blockchain"
                    onChange={(e: any) =>
                        this.setState({
                            inputs: { ...this.state.inputs, blockchain: e.target.value }
                        })
                    }
                >
                    {Object.keys(BLOCKCHAIN_INFO).map(blockchain => (
                        <Select.Item value={blockchain}>{blockchain}</Select.Item>
                    ))}
                </Select>
            </div>
        );
    }

    public renderImport() {
        return <div class="tab-content-import">IMPORT</div>;
    }

    public render() {
        const ContentComponent = this.TABS[this.state.activeTabIndex].contentComponent;
        return (
            <div class="create-account-page">
                <TabBar class="tab-bar" ref={ref => (this.tabBarRef = ref)}>
                    {this.TABS.map((tab, index) => (
                        <TabBar.Tab active={this.state.activeTabIndex === index}>
                            <TabBar.TabLabel>
                                <Translate text={tab.titleKey} />
                            </TabBar.TabLabel>
                        </TabBar.Tab>
                    ))}
                </TabBar>
                <ContentComponent />
            </div>
        );
    }
}
