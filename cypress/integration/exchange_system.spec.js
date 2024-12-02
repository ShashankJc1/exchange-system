describe('Exchange System', () => {
    it('Registers a user', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Username"]').type('testuser');
      cy.get('input[placeholder="Email"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.contains('Register').click();
      cy.on('window:alert', (text) => {
        expect(text).to.contains('User registered successfully');
      });
    });
  
    it('Logs in a user', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Go to Login').click();
      cy.get('input[placeholder="Email"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.contains('Login').click();
      cy.contains('View Offers');
    });
  
    it('Posts an offer', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Go to Login').click();
      cy.get('input[placeholder="Email"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.contains('Login').click();
      cy.contains('Post an Offer').click();
      cy.get('input[placeholder="Item Name"]').type('Laptop');
      cy.get('textarea[placeholder="Description"]').type('A powerful laptop in good condition');
      cy.contains('Post Offer').click();
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Offer posted successfully');
      });
    });
  });
  