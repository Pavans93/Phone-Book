import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../services/contact.service';
import { of } from 'rxjs';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let formBuilder: FormBuilder;
  let contactService: ContactService;

  beforeEach(async () => {
    const contactServiceMock = {
      getContacts: jasmine.createSpy('getContacts').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ContactListComponent],
      providers: [
        FormBuilder,
        { provide: ContactService, useValue: contactServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService);
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contacts on initialization', () => {
    expect(contactService.getContacts).toHaveBeenCalled();
  });

  it('should return the contactForm controls', () => {
    const firstNameControl = formBuilder.control('', [Validators.required]);
    const lastNameControl = formBuilder.control('', [Validators.required]);
    const phoneControl = formBuilder.control('', [Validators.required]);
    component.contactForm = formBuilder.group({
      firstName: firstNameControl,
      lastName: lastNameControl,
      phone: phoneControl
    });
    expect(component.f.firstName).toBe(firstNameControl);
    expect(component.f.lastName).toBe(lastNameControl);
    expect(component.f.phone).toBe(phoneControl);
  });

  it('should set edit mode and update form values when editing a contact', () => {
    const contact = {
      "firstName": "Amit",
      "lastName": "Roy",
      "phone": "9876543210",
      "id": 1
    };
    const patchedValueSpy = spyOn(component.contactForm, 'patchValue').and.callThrough();
    component.editContact(contact);
    expect(component.text).toBe('Edit');
    expect(component.editMode).toBeTrue();
    expect(component.currentContact).toEqual(contact);
    expect(patchedValueSpy).toHaveBeenCalledWith(contact);
  });

  it('should delete a contact and reset form when deleteContact is called', () => {
    const contact = {
      "firstName": "Amit",
      "lastName": "Roy",
      "phone": "9876543210",
      "id": 1
    };
    component.contacts = [contact];
    component.currentContact = contact;
    spyOn(component.contacts, 'splice').and.callThrough();
    spyOn(component, 'cancel');
    component.deleteContact(contact);
    expect(component.text).toBe('Add');
    expect(component.contacts.splice).toHaveBeenCalledWith(0, 1);
    expect(component.cancel).toHaveBeenCalled();
  });

  it('should update a contact if in edit mode, or add a new contact if not in edit mode', () => {
    const existingContact = {
      "firstName": "Amit",
      "lastName": "Roy",
      "phone": "9876543210",
      "id": 1
    };
    const updatedContact = { ...existingContact, firstName: 'Pavan' };
    component.contacts = [existingContact];
    component.currentContact = existingContact;
    component.contactForm = formBuilder.group({
      firstName: [updatedContact.firstName, Validators.required],
      lastName: [updatedContact.lastName, Validators.required],
      phone: [updatedContact.phone, Validators.required]
    });
    spyOn(component, 'cancel');
    component.editMode = true;
    component.saveContact();
    expect(component.contacts[0]).toEqual(updatedContact);
    expect(component.cancel).toHaveBeenCalled();
  });

  it('should add a new contact if not in edit mode', () => {
    const newContactData = {
      "firstName": "Pavan",
      "lastName": "S",
      "phone": "9876543210",
      "id": 1
    };
    component.contacts = [];
    component.currentContact = {};
    component.contactForm = formBuilder.group({
      firstName: [newContactData.firstName, Validators.required],
      lastName: [newContactData.lastName, Validators.required],
      phone: [newContactData.phone, Validators.required]
    });
    spyOn(Date, 'now').and.returnValue(12345);
    spyOn(component, 'cancel');
    component.saveContact();
    const newContact = { ...newContactData, id: 12345 };
    expect(component.contacts.length).toBe(1);
    expect(component.contacts[0]).toEqual(newContact);
    expect(component.cancel).toHaveBeenCalled();
  });

  it('should reset the component properties and form when cancel is called', () => {
    component.editMode = true;
    component.currentContact = {
      "firstName": "Amit",
      "lastName": "Roy",
      "phone": "9876543210",
      "id": 1
    };
    component.text = 'Edit';
    spyOn(component.contactForm, 'reset');
    component.cancel();
    expect(component.editMode).toBeFalse();
    expect(component.currentContact).toEqual({});
    expect(component.contactForm.reset).toHaveBeenCalled();
    expect(component.text).toBe('Add');
  });
});