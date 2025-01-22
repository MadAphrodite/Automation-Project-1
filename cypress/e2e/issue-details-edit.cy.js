const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  // BONUS ASSIGNMENTS

  it("Should check and validate that reporter's name matches regex", () => {
    cy.get('[data-testid="select:reporter"]').click();
    cy.get('[data-testid="avatar:Baby Yoda"]')
      .siblings()
      .invoke("text")
      .should("match", /^[A-Za-z\s]+$/);
    cy.get('[data-testid^="select-option:"]').each(($el) => {
      const reporter = $el.text().trim();
      cy.log(`Reporter: ${reporter}`);
      const regex = /^[A-Za-z\s]+$/;
      expect(reporter).to.match(regex);
    });
  });

  it("Should check that priority fields have ${numberOfPriorities} values", () => {
    const numberOfPriorities = 5;
    let priorities = [];

    // Add already selected priority to the list
    cy.get('[data-testid="select:priority"]')
      .invoke("text")
      .then((extractedPriority) => {
        priorities.push(extractedPriority);
      });
    cy.get('[data-testid="select:priority"]').click();

    // Get number of options from the page
    cy.get("[data-select-option-value]").then(($options) => {
      const itemCount = Cypress.$($options).length;

      // Loop through dropdown options and push them to the array
      for (let index = 0; index < itemCount; index++) {
        cy.get("[data-select-option-value]")
          .eq(index)
          .invoke("text")
          .then((extractedPriority) => {
            priorities.push(extractedPriority);
            // Assert the array has the same length as the expected length
            if (index == itemCount - 1) {
              cy.log("TOTAL calculated array length: " + priorities.length);
              expect(priorities.length).to.be.eq(numberOfPriorities);
            }
          });
      }
    });
  });

  it("Should create an issue without title that has leading and trailing spaces", () => {
    const title = "    Hello world     ";
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="icon:plus"]')
      .next()
      .should("contain", "Create Issue")
      .click();
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get('input[name="title"]').debounced("type", title);
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get('[data-testid="board-list:backlog').within(() => {
      cy.get('[data-testid="list-issue"]')
        .first()
        .find("p")
        .contains(title.trim());
    });
  });
});
