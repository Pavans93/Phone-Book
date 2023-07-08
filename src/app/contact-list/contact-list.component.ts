import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contacts: any[] = [];
  contactForm: any;
  currentContact: any = {};
  editMode = false;
  text: string = 'Add';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) { }

  ngOnInit() {
    this.getContacts();
    this.initForm();
  }

  /*Form Initializtion*/
  initForm() {
    this.contactForm = this.formBuilder.group({
      firstName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),]],
      lastName: ['', [Validators.required,
      Validators.maxLength(20),]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  /*To return form controls*/
  get f() {
    return this.contactForm.controls;
  }

  /*To make a service call to fetch contacts*/
  getContacts() {
    this.contactService.getContacts()
      .subscribe(
        contacts => this.contacts = contacts,
        error => console.log('Error fetching contacts')
      );
  }

  /*To edit existing contact*/
  editContact(contact: any) {
    this.text = 'Edit';
    this.editMode = true;
    this.currentContact = { ...contact };
    this.contactForm.patchValue(this.currentContact);
  }

  /*To delete existing contact*/
  deleteContact(contact: any) {
    this.text = 'Add';
    const index = this.contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      this.errorMessage = 'Contact deleted successfully';
    }
    this.cancel();
  }

  /*To add new contact*/
  saveContact() {
    if (this.editMode) {
      const index = this.contacts.findIndex(c => c.id === this.currentContact.id);
      if (index !== -1) {
        this.contacts[index] = { ...this.currentContact, ...this.contactForm.value };
        this.errorMessage = 'Contact updated successfully';
      }
    } else {
      const newContact = { ...this.currentContact, ...this.contactForm.value, id: Date.now() };
      this.contacts.push(newContact);
      this.errorMessage = 'Contact added successfully';
    }
    this.cancel();
  }

  cancel() {
    this.editMode = false;
    this.currentContact = {};
    this.contactForm.reset();
    this.text = 'Add';
  }

  isFieldInvalid(fieldName: string) {
    const field = this.contactForm.get(fieldName);
    return field.invalid && (field.dirty || field.touched);
  }
}  