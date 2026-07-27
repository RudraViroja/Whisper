import mongoose, {Schema, Document, Mongoose} from "mongoose";

//Mongoose is an ODM (Object Data Modeling) library.

// JavaScript/TypeScript code
//     ↓
//   Mongoose
//     ↓
//  MongoDB Database

//Instead of writing raw MongoDB commands, you work with JavaScript objects.

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

// An interface is a TypeScript feature, It describes
// "An object should contain these properties."

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// Now you're telling MongoDB

// Store Messages like this.

export interface User extends Document{
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}
const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required : [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"] 
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

// mongoose.model<User>(ModelName,Schema)
// this stores User documents

export default UserModel;

// This is one of the most confusing lines for beginners.
// Let's simplify it. Normally you'd write:

// const UserModel = mongoose.model("User", UserSchema);

// That works in a regular Node.js app.
// Why isn't that enough in Next.js?

// Next.js reloads files during development. If the file runs again, mongoose.model("User", UserSchema) tries to create the same model a second time.

// That causes an error like:

// OverwriteModelError:
// Cannot overwrite `User` model once compiled.