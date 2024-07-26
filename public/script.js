const nameInput = document.getElementById("name-input");
const numberInput = document.getElementById("number-input");
const emailInput = document.getElementById("email-input");
const groupInput = document.getElementById("group-input");
const listContainer = document.getElementById("list-container");
const totalContacts = document.getElementById("total-contacts");
const contactSelect = document.getElementById("contact-select");
const groupSelectInput = document.getElementById("group-select-input");
const searchInput = document.getElementById("search-input");

async function fetchContacts() {
    const response = await fetch('http://localhost:3000/contacts');
    const contacts = await response.json();
    return contacts;
}

async function addContact() {
    if (nameInput.value === '' || numberInput.value === '' || emailInput.value === '') {
        alert("You must fill all the fields!");
        return;
    }

    const contact = {
        name: nameInput.value,
        number: numberInput.value,
        email: emailInput.value,
        group: groupInput.value || 'No Group'
    };

    const response = await fetch('http://localhost:3000/addContact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });

    if (response.ok) {
        updateContactList();
        nameInput.value = '';
        numberInput.value = '';
        emailInput.value = '';
        groupInput.value = '';
    }
}

async function removeContact(contactId) {
    await fetch('http://localhost:3000/removeContact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: contactId })
    });
    updateContactList();
}

async function addToGroup() {
    const selectedContactName = contactSelect.value;
    const newGroup = groupSelectInput.value;

    const contact = (await fetchContacts()).find(c => c.name === selectedContactName);
    if (contact) {
        await fetch('http://localhost:3000/updateContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: contact.id, group: newGroup || 'No Group' })
        });
        updateContactList();
    }
}

async function removeFromGroup() {
    const selectedContactName = contactSelect.value;

    const contact = (await fetchContacts()).find(c => c.name === selectedContactName);
    if (contact) {
        await fetch('http://localhost:3000/updateContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: contact.id, group: 'No Group' })
        });
        updateContactList();
    }
}

async function updateContactList() {
    const contacts = await fetchContacts();
    listContainer.innerHTML = '';
    totalContacts.textContent = contacts.length;
    contactSelect.innerHTML = '<option value="">Select a contact</option>';
    
    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${contact.name} - ${contact.number} - ${contact.email} - ${contact.group_name}
            <button onclick="removeContact(${contact.id})">Delete</button>
        `;
        listContainer.appendChild(li);
        
        const option = document.createElement('option');
        option.value = contact.name;
        option.textContent = contact.name;
        contactSelect.appendChild(option);
    });
}

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const contacts = Array.from(listContainer.children);
    contacts.forEach(contact => {
        const contactText = contact.textContent.toLowerCase();
        if (contactText.includes(searchTerm)) {
            contact.style.display = '';
        } else {
            contact.style.display = 'none';
        }
    });
});

updateContactList();

