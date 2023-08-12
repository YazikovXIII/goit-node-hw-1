import { readFile, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "db", "contacts.json");

export async function listContacts() {
  try {
    const data = await readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const foundContact = contacts.find((contact) => contact.id === contactId);

    if (!foundContact) {
      return null;
    }

    return foundContact;
  } catch (error) {
    throw error;
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contactToRemove = contacts.find(
      (contact) => contact.id === contactId
    );

    if (!contactToRemove) {
      return null;
    }

    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return contactToRemove;
  } catch (error) {
    throw error;
  }
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();

    const existingContact = contacts.find((contact) => contact.name === name);
    if (existingContact) {
      throw new Error("Contact with this name already exists.");
    }

    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    throw error;
  }
}
