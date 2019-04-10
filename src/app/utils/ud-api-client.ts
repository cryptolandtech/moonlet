export class UDApiClient {
    private endpoint = 'https://unstoppable-domains-api.appspot.com/v1';
    private path;
    private resolver;

    constructor(resolver: 'ens' | 'zns') {
        this.resolver = resolver;
        this.path = '/' + resolver;
    }

    public async resolve(name: string): Promise<{ name: string; address: string }> {
        try {
            const response = await fetch(this.endpoint + this.path + '/' + name);

            if (response.ok) {
                const data = await response.json();

                let addressField = 'addr';
                if (this.resolver === 'zns') {
                    addressField = 'address';
                }
                if (data[addressField]) {
                    return {
                        name,
                        address: data[addressField]
                    };
                }
            }

            if (response.status === 404) {
                return Promise.reject('NOT_FOUND');
            }

            return Promise.reject('GENERIC_ERROR');
        } catch (error) {
            return Promise.reject('GENERIC_ERROR');
        }
    }

    public async reverse(address: string): Promise<string[]> {
        try {
            const response = await fetch(
                this.endpoint + this.path + '/findDomainsByOwner?owner=' + address
            );
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    return data;
                }
            }

            return Promise.reject('GENERIC_ERROR');
        } catch (error) {
            return Promise.reject('GENERIC_ERROR');
        }
    }
}
