describe("List items", () => {
  beforeEach(() => {
    cy.seedAndVisit();
  });

  it("Properly display completed items", () => {
    cy.get(".todo-list li")
      .filter(".completed")
      .should("have.length", 1)
      .and("contain", "Eggs")
      .find(".toggle")
      .should("be.checked");
  });

  it("Shows remaining todos in footer", () => {
    cy.get(".todo-count").should("contain", 3);
  });

  it("Removes a todo", () => {
    cy.route({
      url: "/api/todos/1",
      method: "DELETE",
      status: 204,
      response: {}
    });

    cy.get(".todo-list li").as("list");

    cy.get("@list")
      .first()
      .find(".destroy")
      .invoke("show")
      .click();

    cy.get("@list")
      .should("have.length", 3)
      .and("not.contain", "Milk");
  });

  it("Marks an incomplete item complete", () => {
    //mark first item in todos array as complete
    cy.fixture("todos").then(todos => {
      //lodash head func get first el in array
      const target = Cypress._.head(todos);
      cy.route(
        "PUT",
        `/api/todos/${target.id}`,
        Cypress._.merge(target, { isComplete: true })
      );
    });

    cy.get(".todo-list li")
      .first()
      .as("first-todo");

    cy.get("@first-todo")
      .find(".toggle")
      .click()
      .should("be.checked");

    cy.get("@first-todo").should("have.class", "completed");
    cy.get(".todo-count").should("contain", 2);
  });
});
