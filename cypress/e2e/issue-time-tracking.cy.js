import IssueCommentsAndTime from "../../cypress/pages/IssueCommentsAndTime";
const issueDetailsModal = '[data-testid="modal:issue-details"]';
const issueTitle = "Try leaving a comment on this issue.";

/* NB! I have added the following lines to cypress.config.js file:
defaultCommandTimeout: 60000,
requestTimeout: 60000,
*/

describe("Issue time tracking", () => {
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
    // Clearing existing values from both time estimation and logging
    IssueCommentsAndTime.clearExistingTimeTracking();
  });

  it("Should add, edit and remove time estimation successfully", () => {
    const valueAmount = 10;
    const newValueAmount = 20;

    // Adding time estimation successfully
    IssueCommentsAndTime.addTimeEstimation(valueAmount);
    IssueCommentsAndTime.assertAddedTimeEstimationVisibility(valueAmount);
    // Editing time estimation successfully
    IssueCommentsAndTime.updateTimeEstimation(valueAmount, newValueAmount);
    IssueCommentsAndTime.assertUpdatedTimeEstimationVisibility(newValueAmount);
    // Removing time estimation successfully
    IssueCommentsAndTime.clearTimeEstimation(newValueAmount);
    IssueCommentsAndTime.assertDeletedTimeEstimationVisibility();
  });

  it("Should add and remove time logging successfully", () => {
    const valueAmount = 10;
    const valueSpent = 2;
    const valueRemaining = 5;

    // Adding time estimation successfully
    IssueCommentsAndTime.addTimeEstimation(valueAmount);
    IssueCommentsAndTime.assertAddedTimeEstimationVisibility(valueAmount);
    // Adding time log to time tracking successfully
    IssueCommentsAndTime.addTimeTracking(valueSpent, valueRemaining);
    IssueCommentsAndTime.assertAddedTimeTrackingVisibility(
      valueAmount,
      valueSpent,
      valueRemaining
    );
    // Removing time log from time tracking successfully
    IssueCommentsAndTime.removeTimeTracking(valueSpent, valueRemaining);
    IssueCommentsAndTime.assertRemovedTimeTrackingVisibility(
      valueAmount,
      valueSpent,
      valueRemaining
    );
  });
});
