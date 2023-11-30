import { Manage } from "./manage";

export interface IUser {
    name: string;
    id: string;
    description: string;
    pw?: string;
    image?: string;
}

export class User {
    public manage: Manage[] = [];
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

    encode(): IUser {
        return {
            name: encodeURI(this.name),
            id: encodeURI(this.id),
            description: encodeURI(this.description),
            pw: this.pw,
            image: ((this.image !== undefined) ? encodeURI(this.image) : undefined),
        }
    }

    decode(): IUser {
        try {
            return {
                name: decodeURI(this.name),
                id: decodeURI(this.id),
                description: decodeURI(this.description),
                pw: this.pw,
                image: ((this.image !== undefined) ? decodeURI(this.image) : undefined),
            }
        } catch {
            //데이터가 인코딩 되어있지 않음
            return this;
        }
    }
}
