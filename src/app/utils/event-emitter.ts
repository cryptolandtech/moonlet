export class EventEmitter {
    private subscribers = [];

    public emit(type: string, data?: any) {
        setTimeout(() =>
            this.subscribers.map(callback => {
                if (typeof callback === 'function') {
                    callback(type, data);
                }
            })
        );
    }

    public subscribe(callback: (type: string, data: any) => any): () => any {
        if (typeof callback === 'function') {
            this.subscribers.push(callback);
        }

        return () => {
            this.subscribers.splice(this.subscribers.indexOf(callback), 1);
        };
    }
}
