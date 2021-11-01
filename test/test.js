const assert = require('assert');
const request = require('supertest');
const { getDatabase } = require('../utils');
const axios = require('axios');

require( 'dotenv' ).config( { allowEmptyValues: true } )
const {TESTING_ID, HOST_URL} = process.env;

// Compare values from source in target if they exist and they are equal
const objectValuesInObject = (source, target) => {
  
  const filteredSourceKeys = Object.keys(source).filter(key => {
    return source[key] === target[key];
  })

  // source: {a: 1, b: 6, c: 3}
  // target: {a: 1, b: 2, c: 3, d: 4, e: 5}

  // a === a => TRUE => filteredSourceKeys = [a];
  // b === b => FALSE => filteredSourceKeys = [a];
  // c === c => TRUE => filteredSourceKeys = [a, c];

  // filteredSourceKeys.length (2) === sourceKeys.lenght (3)

  return Object.keys(source).length === filteredSourceKeys.length;

} 

const testInvitation = {
    "miri": "TEST_MIRI",
    "invitati": "TEST_INVITATII",
    "mesaj": "TEST_MESAJ",
    "dataNuntii": 111111111,
    "acceptat": true
}

const changedTestInvitation = {
  "mesaj": "TEST_MESAJ_SCHIMBAT",
  "acceptat": false
}

describe('CREATE /invitatii', function() {
  it('Create 1 single invitation.', (done) => {
   axios({ 
      method: 'post', 
      baseURL: HOST_URL,
      url: '/invitatii',
      responseType: 'application/json',
      data: testInvitation,
      params: {
        test: true
      }
    })
    .then( response => {
        if(response.data[TESTING_ID]) {
          done()
        } else {
          done('Nu s-a salvat Invitatia de Test');
        }
     })
    .catch(  err => {
      console.log(err);
      done('Probleme de sistem');
    })
   
  });
});


describe('GET /invitatii', function() {
  it('Get 1 single invitation.', (done) => {
   axios({ 
      method: 'get', 
      baseURL: HOST_URL,
      url: '/invitatii/'+TESTING_ID,
      responseType: 'application/json'
    })
    .then( response => {
        const invitation = response.data;
        if( invitation && objectValuesInObject(testInvitation, invitation) ) {
          done()
        } else {
          done('Nu exista Invitatia de Test');
        }
     })
    .catch(  err => {
      console.log(err);
      done('Probleme de sistem');
    })
   
  });
});



describe('GET NOT FOUND /invitatii', function() {
  it('Testing Not FOund Invitation.', (done) => {
   axios({ 
      method: 'get', 
      baseURL: HOST_URL,
      url: '/invitatii/lkjasdlkjasljkdljkasdjlkasjkl',
      responseType: 'application/json'
    })
    .catch(  err => {
      if(err.response.status === 404) {
        done();
      } else {
        done('Probleme de sistem');
      }
    })
   
  });
});

describe('LIST /invitatii', function() {
  it('List all invitations.', (done) => {
   axios({ 
      method: 'get', 
      baseURL: HOST_URL,
      url: '/invitatii',
      responseType: 'application/json'
    })
    .then( response => {
        const invitations = response.data;
        if( invitations && Object.keys(invitations).length > 0 ) {
          done()
        } else {
          done('Nu exista Invitatii create');
        }
     })
    .catch(  err => {
      console.log(err);
      done('Probleme de sistem');
    })
   
  });
});

describe('UPDATE /invitatii', function() {
  it('Update 1 single invitation.', (done) => {
   axios({ 
      method: 'put', 
      baseURL: HOST_URL,
      url: '/invitatii/'+TESTING_ID,
      responseType: 'application/json',
      data: changedTestInvitation
    })
    .then( response => {
      const invitation = response.data[TESTING_ID];
        if( invitation && objectValuesInObject(changedTestInvitation, invitation) ) {
          done()
        } else {
          done('Nu s-a modificat Invitatia de Test');
        }
     })
    .catch(  err => {
      console.log(err);
      done('Probleme de sistem');
    })
   
  });
});



describe('DELETE /invitatii', function() {
  it('Delete 1 single invitation.', (done) => {
   axios({ 
      method: 'delete', 
      baseURL: HOST_URL,
      url: '/invitatii/'+TESTING_ID,
      responseType: 'application/json',
      data: changedTestInvitation
    })
    .then( response => {
      done();
     })
    .catch(  err => {
      console.log(err);
      done('Probleme de sistem');
    })
   
  });
});
