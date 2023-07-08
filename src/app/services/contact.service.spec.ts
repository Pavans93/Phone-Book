import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let contactService: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });

    contactService = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve contacts from the API', () => {
    const mockContacts = [
      {
        "firstName": "Amit",
        "lastName": "Roy",
        "phone": "9876543210",
        "id": 1
      },
      {
        "firstName": "Aakash",
        "lastName": "Choudhury",
        "phone": "9876584431",
        "id": 2
      },
      {
        "firstName": "Arun",
        "lastName": "Dey",
        "phone": "5748493812",
        "id": 3
      },
      {
        "firstName": "Vikash",
        "lastName": "Trivedi",
        "phone": "9873625261",
        "id": 4
      },
      {
        "firstName": "Gaurav",
        "lastName": "Gupta",
        "phone": "7002873284",
        "id": 5
      }
    ];
    
    contactService.getContacts().subscribe((contacts) => {
      expect(contacts).toEqual(mockContacts);
    });
    const request = httpMock.expectOne('https://my-json-server.typicode.com/voramahavir/contacts-mock-response/contacts');
    expect(request.request.method).toBe('GET');
    request.flush(mockContacts);
  });
});
