// contactsServices.js
import fs from "fs/promises"
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");
const updateContact = (contacts) => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts(){
    const data = await fs.readFile(contactsPath, "utf-8")
    return JSON.parse(data);
}

export async function getContactById(contactId){
    const data = await listContacts();
    const result = data.find((contact) => contact.id === contactId);
    return result || null;
}

export async function removeContact(contactId){
    const data = await listContacts();
    const index = data.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [result] = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return result;
}

export async function addContact(name, email, phone){
    const data = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };
    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return newContact;
}

export async function updateContactById(contactId, name, email, phone) {
    const data = await listContacts();
    const index = data.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    data[index] = { ...data[index], name, email, phone };
    await updateContact(data);
    return data[index];
}
