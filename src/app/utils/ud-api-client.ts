export class UDApiClient {
    private endpoint = 'https://unstoppabledomains.com/api/v1';
    private coin;

    constructor(coin: string) {
        this.coin = coin;
    }

    public async resolve(name: string): Promise<{ name: string; address: string }> {
        try {
            const response = await fetch(this.endpoint + '/' + name.toLocaleLowerCase());

            if (response.ok) {
                const data = await response.json();

                const address = data.addresses[this.coin];
                if (address) {
                    return {
                        name,
                        address
                    };
                }
            }

            return Promise.reject('NOT_FOUND');
        } catch (error) {
            return Promise.reject('GENERIC_ERROR');
        }
    }
}
