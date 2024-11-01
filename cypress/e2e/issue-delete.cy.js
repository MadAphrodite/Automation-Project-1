const issueDetailModal = '[data-testid="modal:issue-details"]';
const confirmPopup = '[data-testid="modal:confirm"]';
const backlogList = '[data-testid="board-list:backlog"]';
const issuesList = '[data-testid="list-issue"]';
const deleteButtonIcon = '[data-testid="icon:trash"]';
const confirmDeleteButton = "Delete issue";
const cancelDeleteButton = "Cancel";
const closeModalButton = '[data-testid="icon:close"]';
const issueTitle = "This is an issue of type: Task.";
const confirmHeading = "Are you sure you want to delete this issue?";
const confirmText = "Once you delete, it's gone for good";
const amountOfIssuesAfterDeletion = 3;
const amountOfIssuesAfterCancel = 4;

function clickDeleteButtonIcon() {
  cy.get(issueDetailModal).within(() => {
    cy.get(deleteButtonIcon).click();
  });
  cy.get(confirmPopup).should("be.visible");
}

function confirmDeletion() {
  cy.get(confirmPopup).within(() => {
    cy.contains(confirmHeading).should("be.visible");
    cy.contains(confirmText).should("be.visible");
    cy.contains(confirmDeleteButton).should("be.visible").click();
  });
  cy.get(confirmPopup).should("not.exist");
  cy.get(issueDetailModal).should("not.exist");
  cy.get(backlogList).should("have.length", "1").and("be.visible");
}

function cancelDeletion() {
  cy.get(confirmPopup).within(() => {
    cy.contains(confirmHeading).should("be.visible");
    cy.contains(confirmText).should("be.visible");
    cy.contains(cancelDeleteButton).should("be.visible").click();
  });
  cy.get(confirmPopup).should("not.exist");
  cy.get(issueDetailModal).should("be.visible");
}

function closeIssueDetailModal() {
  cy.get(issueDetailModal).get(closeModalButton).first().click();
  cy.get(issueDetailModal).should("not.exist");
  cy.get(backlogList).should("have.length", "1").and("be.visible");
}

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
    cy.get(issueDetailModal).should("be.visible");
  });

  it("Should delete an issue successfully", () => {
    clickDeleteButtonIcon();
    confirmDeletion();
    cy.get(backlogList).within(() => {
      cy.get(issuesList).should("have.length", amountOfIssuesAfterDeletion);
      cy.contains(issueTitle).should("not.exist");
    });
  });

  it("Should cancel deletion process successfully", () => {
    clickDeleteButtonIcon();
    cancelDeletion();
    closeIssueDetailModal();
    cy.get(backlogList).within(() => {
      cy.get(issuesList).should("have.length", amountOfIssuesAfterCancel);
      cy.contains(issueTitle).should("be.visible");
    });
  });
});
