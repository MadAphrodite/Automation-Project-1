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

  // BONUS ASSIGNMENTS 1 and 2

  it("Should check and validate priority dropdown values", () => {
    const expectedLength = 5;
    const expectedValues = ["Lowest", "Low", "Medium", "High", "Highest"];
    let priorityList = [];

    // Get initially selected value and push it to the array
    cy.get('[data-testid="select:priority"]').within(() => {
      cy.get('[data-testid="icon:arrow-up"]')
        .next("div")
        .invoke("text")
        .then((initialValue) => {
          priorityList.push(initialValue.trim());
          cy.log(`Initial selected priority value: ${initialValue}`);
        });
    });
    // Loop through dropdown options and push them to the array
    cy.get('[data-testid="select:priority"]').click();
    cy.get('[data-testid="select:priority"]')
      .siblings()
      .find('div[data-testid^="select-option"]')
      .each(($el) => {
        const priorityName = $el.text().trim();
        priorityList.push(priorityName.trim());
        cy.log(`Added priority: ${priorityName}`);
        cy.log(`Array length: ${priorityList}`);
      });
    // Assert the array has the same length and values as the expected length and values
    cy.wrap(priorityList).should("have.length", expectedLength);
    expectedValues.forEach((value) => {
      cy.wrap(priorityList).should("include", value);
    });
  });
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
});
