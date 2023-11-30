import { escape } from "querystring";

export interface EncodedUser {
    name: string;
    id: string;
    description: string;
    image?: string;
}

export class User {
    constructor(
        public name: string,
        public id: string,
        public description: string,
        public pw?: string,
        public image?: string,
    ) {}

    withoutPw(): User {
        return new User(this.name, this.id, this.description, undefined, this.image);
    }

    encode(): EncodedUser {
        return {
            name: escape(this.name),
            id: escape(this.id),
            description: escape(this.description),
            image: ((this.image !== undefined) ? escape(this.image) : undefined),
        }
    }
}
