import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth'{
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user'] 
        //added it(DefaultSession['user']) so your custom Session.user fields (_id, isVerified, isAcceptingMessages, and username) are combined with the built-in fields, instead of replacing them. That keeps standard NextAuth user properties available elsewhere in the app while adding your own.
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}