class SessionStore {
    findSession(id) { }
    saveSession(id, session) { }
    findAllSessions() { }
}

class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
        if (InMemorySessionStore.instance) {
            return InMemorySessionStore.instance;
        }
        InMemorySessionStore.instance = this;
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}

export default new InMemorySessionStore();