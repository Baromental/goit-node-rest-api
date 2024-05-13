import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const contactsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      }
}, {versionKey: false, timestamps:true})

contactsSchema.pre("findOneAndUpdate", setUpdateSetting)

contactsSchema.post("save", handleSaveError )

contactsSchema.post("findOneAndUpdate", handleSaveError)

const Contacts = model("contacts", contactsSchema);

export default Contacts;
