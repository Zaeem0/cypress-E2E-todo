describe("Input Form", () => {
  beforeEach(() => cy.seedAndVisit([]));

  it("Focuses input on load", () => {
    cy.focused().should("have.class", "new-todo");
  });

  it("Accepts text input", () => {
    const typedText = "Buy Milk";
    cy.get(".new-todo")
      .type(typedText)
      .should("have.value", typedText);
  });

  context("Form Submission", () => {
    beforeEach(() => {
      cy.server();
    });
    it("Adds a new todo on submit", () => {
      const itemText = "Buy Eggs";
      //Stub response
      cy.route("POST", "/api/todos", {
        name: itemText,
        id: 1,
        isComplete: false
      });

      // Enter new todo then clear input field
      cy.get(".new-todo")
        .type(itemText)
        .type("{enter}")
        .should("have.value", "");
      // Check list item has been added with correct text
      cy.get(".todo-list li")
        .should("have.length", 1)
        .and("contain", itemText);
    });

    it("Shows an error message on a failed submission", () => {
      //Stub Internal Server Error
      cy.route({
        url: "/api/todos",
        method: "POST",
        status: 500,
        response: {}
      });
      // type `test` and hit enter
      cy.get(".new-todo").type("test{enter}");
      // Do assertions...
      // list should be empty and displaying error
      cy.get(".todo-list li").should("not.exist");
      cy.get(".error").should("be.visible");
    });
  });
});
