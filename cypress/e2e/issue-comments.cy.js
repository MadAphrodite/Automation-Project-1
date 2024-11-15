import IssueCommentsAndTime from "../../cypress/pages/IssueCommentsAndTime";
const issueTitle = "This is an issue of type: Task.";

/* NB! I have added the following lines to cypress.config.js file:
defaultCommandTimeout: 60000,
requestTimeout: 60000,
*/

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  it("Should create, edit and delete a comment successfully", () => {
    // Creating a new comment, asserting visibility
    IssueCommentsAndTime.addNewComment();
    IssueCommentsAndTime.assertNewCommentVisibility();

    // Editing the new comment, asserting visibility
    IssueCommentsAndTime.clickEditCommentButton();
    IssueCommentsAndTime.editPreviousCommentText();
    IssueCommentsAndTime.assertEditedCommentVisibility();

    // Cancelling editing of the edited comment successfully
    IssueCommentsAndTime.cancelEditingComment();
    IssueCommentsAndTime.assertEditedCommentVisibility();

    // Cancelling deleting of the edited comment successfully
    IssueCommentsAndTime.clickDeleteCommentButton();
    IssueCommentsAndTime.cancelDeletionConfirmationPopup();
    IssueCommentsAndTime.assertCancelledDeletionCommentStillExists();

    // Deleting the edited comment successfully
    IssueCommentsAndTime.clickDeleteCommentButton();
    IssueCommentsAndTime.confirmDeletionConfirmationPopup();
    IssueCommentsAndTime.assertDeletedCommentDoesNotExist();
  });
});
