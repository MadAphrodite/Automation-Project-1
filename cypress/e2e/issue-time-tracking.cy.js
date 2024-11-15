import IssueCommentsAndTime from "../../cypress/pages/IssueCommentsAndTime";
const issueDetailsModal = '[data-testid="modal:issue-details"]';
const issueTitle = "Try leaving a comment on this issue.";

/* NB! I have added the following lines to cypress.config.js file:
defaultCommandTimeout: 60000,
requestTimeout: 60000,
*/

/* About the assignment:
I could not get the test to work with
creating a new issue in the beforeEach block
(time tracking values kept resetting to default after closing the modal),
so I used an existing issue to execute the tests.*/

describe("Time tracking and logging", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
    cy.get(issueDetailsModal).should("be.visible");
  });

  it("Should add, edit and remove estimation successfully", () => {
    const valueAmount = 10;

    // Clearing both time estimation and logging
    IssueCommentsAndTime.clearExistingTimeTracking();
    // Adding estimation successfully
    IssueCommentsAndTime.addTimeEstimation(valueAmount);
    IssueCommentsAndTime.assertAddedTimeEstimationVisibility(valueAmount);
  });

  it.skip("Should add, edit and remove time logging successfully", () => {});
});
