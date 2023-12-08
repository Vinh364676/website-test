export type UserState = {
    userList: Array<User>;
};


export type User = {
    id: number;
    customerId: number;
    email:string;
    displayName:string;
};