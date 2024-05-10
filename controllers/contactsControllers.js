import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = async (req, res) => {
  const allContacts = await contactsService.listContacts();

  res.json(allContacts);
};

export const getOneContact = async (req, res) => {

  const {id} = req.params;
  const contact = await contactsService.getContactById(id);
  if(!contact){
    throw HttpError(404, `Contact with id=${id} not found`)
  }

  res.json(contact)
};

export const deleteContact = async (req, res) => {

  const{id} = req.params;
  const removedContact = await contactsService.removeContact(id);
  if(!removedContact){
    throw HttpError(404, "Not found")
  }

  res.json(removedContact);
};

export const createContact = async (req, res) => {

  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {

  const {id} = req.params;
  const updetedContact = await contactsService.updateContact(id)
  if(!updetedContact){
    throw HttpError(404, error.message)
  }

  res.json(updetedContact)
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const updatedStatus = await contactsService.updateStatusById(id, req.body);
  if (!updatedStatus) {
    throw HttpError(404, "Not found")
  }
  res.json(updatedStatus)
}

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};