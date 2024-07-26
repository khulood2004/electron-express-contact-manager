const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  addContact: (contact) => ipcRenderer.invoke('add-contact', contact),
  getContacts: () => ipcRenderer.invoke('get-contacts'),
  removeContact: (id) => ipcRenderer.invoke('remove-contact', id)
});


