import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const {_id: owner} = req.user;
  const filter = {owner};
  const {page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const setting = {skip, limit};
  const allContacts = await contactsService.listContacts({filter});
  res.json(allContacts);
};

export const getOneContact = async (req, res) => {
  const {id: _id} = req.params;
  const {_id: owner} = req.user;
  const contact = await contactsService.getContact({owner, _id});
  if(!contact){
    throw HttpError(404, `Contact with id=${id} not found`)
  }

  res.json(contact)
};

export const deleteContact = async (req, res) => {
  const {id: _id} = req.params;
  const {_id: owner} = req.user;
  const removedContact = await contactsService.removeContact({owner, _id});
  if(!removedContact){
    throw HttpError(404, "Not found")
  }

  res.json(removedContact);
};

export const createContact = async (req, res) => {
  const {_id: owner} = req.user;
  const newContact = await contactsService.addContact({...req.body, owner});
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const {id: _id} = req.params;
  const {_id: owner} = req.user;
  const updetedContact = await contactsService.updateContact({owner, _id},req.body)
  if(!updetedContact){
    throw HttpError(404, error.message)
  }

  res.json(updetedContact)
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const updatedStatus = await contactsService.updateStatus(id, req.body);
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