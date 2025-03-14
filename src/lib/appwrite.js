import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67d013a6000a87361603'); // Replace with your project ID

const account = new Account(client);
const databases = new Databases(client);
const database_id = "67d08c2700122fa1dd93";

export { account, client, databases, database_id };
export { ID } from 'appwrite';
