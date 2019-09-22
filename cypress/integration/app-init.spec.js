describe("App initialization", () => {
  it("loads todos on page load", () => {
    cy.seedAndVisit();
    cy.get(".todo-list li").should("have.length", 4);
  });

  it("Displays an error on failure", () => {
    //setup api data
    cy.server();
    cy.route({
      url: "/api/todos",
      method: "GET",
      status: 500,
      response: {}
    });
    cy.visit("/");

    cy.get(".todo-list li").should("not.exist");

    cy.get(".error").should("be.visible");
  });
});
