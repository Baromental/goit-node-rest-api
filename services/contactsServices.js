// contactsServices.js
import Contacts from "../models/Contacts.js";

export const listContacts = () => Contacts.find();

export const getContactById = async(contactId)=>{
    const contact = Contacts.findById({_id:contactId});
    return contact;
}

export const removeContact = async(contactId)=> Contacts.findByIdAndDelete(contactId);

export const addContact = (data) => Contacts.create(data);

export const updateContactById = async(contactId, data)=> Contacts.findByIdAndUpdate(contactId, data);

export const updateStatusById = async (contactId, data) => Contacts.findByIdAndUpdate(contactId, data)