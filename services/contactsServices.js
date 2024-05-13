// contactsServices.js
import Contacts from "../models/Contacts.js";

export const listContacts = ({ filter = {}, fields, setting = {} }) => 
    Contacts.find(filter, fields, setting).populate("owner", "email subscription").populate("owner", "email subscription");

export const getContact = filter => Contacts.findOne(filter)

export const removeContact = async(filter)=> Contacts.findOneAndDelete(filter);

export const addContact = (data) => Contacts.create(data);

export const updateContact = async(filter, data)=> Contacts.findByOneAndUpdate(filter, data);

export const updateStatus = async (filter, data) => Contacts.findOneAndUpdate(filter, data)