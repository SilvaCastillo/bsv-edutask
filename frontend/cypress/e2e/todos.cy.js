describe('Test the to-do items', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user

  before(function () {
    // Step 1: Create user from a fixture
    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email

          // Step 2: Now that email is ready, proceed to login and task creation
          cy.viewport(1280, 800)
          cy.visit('http://localhost:3000')

          // Log in to the page
          cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email)

          cy.get('form').submit()

          // assert that the user is now logged in
          cy.get('h1')
            .should('contain.text', 'Your tasks, ' + name)

          // Create a Task
          cy.contains('div', 'Title')
            .find('input[type=text]')
            .type("Learn code ")

          cy.contains('div', 'YouTube URL')
            .find('input[type=text]')
            .type("66tfvFeALBQ")

          cy.wait(1000)
        
          cy.get('form').submit()

        })
      })
  })

  beforeEach(function () {
    cy.viewport(1280, 800)
    cy.visit('http://localhost:3000')

    // Log in
    cy.contains('div', 'Email Address')
      .find('input[type=text]')
      .type(email)

    cy.get('form').submit()

    // Wait for dashboard header
    cy.get('h1').should('contain.text', 'Your tasks, ' + name)

    // Select task group after login
    cy.get('div.container-element')
      .contains('div.title-overlay', 'Learn code')
      .parents('div.container-element')
      .click()

    cy.get('div.popup').should('be.visible')
  })


  it('R8UC1: create a to-do item when input is valid', () => {
    cy.get('div.popup')
      .find('ul li form.inline-form')
      .find('input[type=text]')
      .type('Learn JS{enter}')

    // Check if a new to-do item is created
    cy.get('div.popup')
      .contains('li.todo-item', 'Learn JS')
  })

  it('R8UC1: create a to-do item when input is empty', () => {
    cy.get('div.popup')
      .find('ul li form.inline-form')
      .find('input[type=submit]')
      .should('be.disabled')
  })


  it('R8UC2: should mark item as completed when toggled', () => {
    cy.get('div.popup')
      .contains('li.todo-item', 'Learn JS')
      .find('span.checker.unchecked')
      .click()
  })


  it('R8UC2: should mark item as active when toggled again', () => {
    cy.get('div.popup')
      .contains('li.todo-item', 'Learn JS')
      .find('span.checker.checked')
      .click()
  })


  it('R8UC3: delete a to-do item', () => {
    // Create task "Learn Python"
    cy.get('div.popup')
      .find('ul li form.inline-form')
      .find('input[type=text]')
      .type('Learn Python{enter}')

    // Wait until it's created
    cy.contains('li.todo-item', 'Learn Python').should('exist')

    // Remove the Learn Python to-do item
    cy.get('div.popup')
      .contains('li.todo-item', 'Learn Python')
      .find('span.remover')
      .click()
  })


  after(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log('Delete response:', JSON.stringify(response.body))
    })
  })
  })