export type RegisterEntry<T> = {
    key: string,
    value: T
}

/**
 * A Map with unique keys, use register() to add entries
 * @extends Map
 */
export class Registry<T> extends Map {

    constructor(init?: RegisterEntry<T> | RegisterEntry<T>[]) {
        super();
        if (init) {
            this.register(init)
        }
    }

    /**
     * Add entries to the registry. Checks if the keys are not in the registry.
     * @param entries one or many entrie(s) to add in the registry
     */
    register(entries: RegisterEntry<T> | RegisterEntry<T>[]): void {
        if (!Array.isArray(entries)) {
            entries = [entries];
        }

        entries.forEach((entry: RegisterEntry<T>): void => {
            if (this.has(entry.key)) {
                return console.error(`key "${entry.key}" already exist in this registry.`);
            }
            this.set(entry.key, entry.value);
        })
    }
    
}

