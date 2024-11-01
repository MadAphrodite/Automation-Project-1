import IssueModal from "../../pages/IssueModal";
const issueTitle = "This is an issue of type: Task.";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.contains(issueTitle).click();
      });
    IssueModal.getIssueDetailModal();
  });

  it("Should delete issue successfully", () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.validateExpectedAmountIssues(3);
  });

  it("Should cancel deletion process successfully", () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
    IssueModal.validateExpectedAmountIssues(4);
  });
});
