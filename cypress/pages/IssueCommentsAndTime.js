class IssueCommentsAndTime {
  constructor() {
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailsModal = '[data-testid="modal:issue-details"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = ".ql-editor";
    this.assignee = '[data-testid="select:userIds"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.doneList = '[data-testid="board-list:done"]';
    this.submitButton = 'button[type="submit"]';
    this.closeIcon = '[data-testid="icon:close"]';
    this.trackingIcon = '[data-testid="icon:stopwatch"]';
    this.timeEstimationTitle = "Original Estimate (hours)";
    this.timeEstimationField = 'input[placeholder="Number"]';
    this.addCommentField = "Add a comment...";
    this.addCommentTextarea = 'textarea[placeholder="Add a comment..."]';
    this.issueComment = '[data-testid="issue-comment"]';
    this.confirmDeletePopup = '[data-testid="modal:confirm"]';
    this.confirmCommentHeading =
      "Are you sure you want to delete this comment?";
    this.confirmCommentText = "Once you delete, it's gone for good.";
    this.comment = "TEST_COMMENT_B";
    this.editedComment = "TEST_COMMENT_EDITED_B";
    this.newIssueTitle = "Try leaving a comment on this issue.";
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailsModal() {
    return cy.get(this.issueDetailsModal);
  }

  // Creating an issue

  selectIssueType(issueType) {
    cy.get(this.issueType).click("bottomRight");
    cy.get(`[data-testid="select-option:${issueType}"]`)
      .trigger("mouseover")
      .trigger("click");
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click("bottomRight");
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).debounced("type", title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.type);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
    cy.get(this.issueModal).should("not.exist");
    cy.wait(3000);
    cy.contains("Issue has been successfully created.").should("exist");
  }

  ensureIssueIsCreatedAndVisible(expectedAmountIssues, issueDetails) {
    cy.reload();
    cy.get(this.issueModal).should("not.exist");
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountIssues)
          .first()
          .find("p")
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
          "be.visible"
        );
        cy.get(this.issuesList)
          .contains(issueDetails.title)
          .should("be.visible")
          .click();
      });
    this.getIssueDetailsModal().should("be.visible");
  }

  // COMMENTS

  // Creating a new comment section

  addNewComment() {
    this.getIssueDetailsModal().within(() => {
      cy.contains(this.addCommentField).should("exist").click();
      cy.get(this.addCommentTextarea).type(this.comment);
      this.clickSaveCommentButton();
      cy.contains(this.addCommentField).should("exist");
    });
  }

  assertNewCommentVisibility() {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.issueComment)
        .should("have.length", "2")
        .first()
        .should("contain", this.comment)
        .and("be.visible");
    });
    cy.reload();
    cy.wait(10000);
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .first()
      .contains(this.comment)
      .should("be.visible");
  }

  // Editing a comment section

  clickEditCommentButton() {
    cy.get(this.issueComment)
      .should("have.length", "2")
      .and("be.visible")
      .first()
      .contains("Edit")
      .click()
      .should("not.exist");
  }

  clickSaveCommentButton() {
    cy.contains("button", "Save").should("exist").click().should("not.exist");
  }

  clickCancelCommentButton() {
    cy.contains("button", "Cancel").should("exist").click().should("not.exist");
  }

  editPreviousCommentText() {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.addCommentTextarea)
        .should("contain", this.comment)
        .clear()
        .type(this.editedComment);
      this.clickSaveCommentButton();
    });
  }

  assertEditedCommentVisibility() {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.issueComment)
        .first()
        .should("contain", "Edit")
        .and("contain", this.editedComment)
        .and("be.visible");
    });
    cy.reload();
    cy.wait(10000);
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .first()
      .contains(this.editedComment)
      .should("be.visible");
  }

  cancelEditingComment() {
    this.getIssueDetailsModal().within(() => {
      this.clickEditCommentButton();
      cy.get(this.addCommentTextarea)
        .should("contain", this.editedComment)
        .clear()
        .type(this.comment);
      this.clickCancelCommentButton();
    });
  }

  // Deleting a comment section

  clickDeleteCommentButton() {
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .first()
      .should("contain", this.editedComment)
      .contains("Delete")
      .click();
  }

  cancelDeletionConfirmationPopup() {
    cy.get(this.confirmDeletePopup)
      .should("exist")
      .within(() => {
        cy.contains(this.confirmCommentHeading).should("be.visible");
        cy.contains(this.confirmCommentText).should("be.visible");
        cy.contains("button", "Delete comment").should("exist");
        cy.contains("button", "Cancel").should("exist").click();
      });
    cy.get(this.confirmDeletePopup).should("not.exist");
  }

  confirmDeletionConfirmationPopup() {
    cy.get(this.confirmDeletePopup)
      .should("exist")
      .within(() => {
        cy.contains(this.confirmCommentHeading).should("be.visible");
        cy.contains(this.confirmCommentText).should("be.visible");
        cy.contains("button", "Cancel").should("exist");
        cy.contains("button", "Delete comment").should("exist").click();
      });
    cy.get(this.confirmDeletePopup).should("not.exist");
  }

  assertCancelledDeletionCommentStillExists() {
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .should("have.length", "2")
      .contains(this.editedComment)
      .should("exist");
    cy.reload();
    cy.wait(10000);
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .should("have.length", "2")
      .contains(this.editedComment)
      .should("exist");
  }

  assertDeletedCommentDoesNotExist() {
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .should("have.length", "1")
      .contains(this.editedComment)
      .should("not.exist");
    cy.reload();
    cy.wait(10000);
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .should("have.length", "1")
      .contains(this.editedComment)
      .should("not.exist");
  }

  // TIME TRACKING

  // Estimation and logging default state(empty)

  getDefaultTimeTrackingField(valueAmount) {
    this.getIssueDetailsModal()
      .find(this.trackingIcon)
      .next()
      .children(1)
      .should("contain", "No time logged")
      .and("be.visible")
      .next("div")
      .should("contain", `"${valueAmount}h estimated"`)
      .and("be.visible");
  }

  clickDefaultTimeTrackingField() {
    this.getDefaultTimeTrackingField().click();
  }

  getDefaultInputTimeEstimationField() {
    this.getIssueDetailsModal().within(() => {
      cy.contains(this.timeEstimationTitle)
        .next('input[placeholder="Number"]')
        .should("have.value", null)
        .and("be.visible")
        .click();
    });
  }

  clickDefaultTimeEstimationField() {
    this.getDefaultInputTimeEstimationField().click();
  }

  // Filling estimation and logging with custom values

  getInputTimeEstimationField(valueAmount) {
    this.getIssueDetailsModal()
      .find("div")
      .contains(this.timeEstimationTitle)
      .next("input")
      .contains("placeholder", "Number")
      .should("have.value", valueAmount)
      .and("be.visible");
  }

  clickEditedTimeEstimationField(valueAmount) {
    this.getInputTimeEstimationField(valueAmount).click();
  }

  // Editing estimation and logging

  editDefaultTimeEstimation(valueAmount) {
    this.getDefaultInputTimeEstimationField().type(valueAmount);
    this.getDefaultTimeTrackingField(valueAmount);
  }

  editCustomValueTimeEstimation(valueAmount, newValueAmount) {
    this.clickEditedTimeEstimationField(valueAmount)
      .clear()
      .type(newValueAmount);
    this.getDefaultTimeTrackingField()
      .next("div")
      .should("contain", "${newValueAmount}h estimated")
      .and("be.visible");
  }

  // example

  assertDefaultTimeTrackingState() {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField)
        .should("have.value", "")
        .and("be.visible");
      cy.get(this.trackingIcon)
        .next()
        .children(1)
        .should("contain", "No time logged")
        .and("be.visible");
    });
  }

  addTimeEstimation(valueAmount) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField).click().type(valueAmount);
      cy.contains("Updated at").click();
      cy.wait(10000);
    });
  }

  assertEditedTimeEstimationVisibility(valueAmount, issueDetails) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField)
        .should("have.value", valueAmount)
        .and("be.visible");
      cy.get(this.closeIcon).first().click();
    });
    cy.get(this.issueDetailsModal).should("not.exist");
    cy.reload();
    cy.get(this.doneList)
      .should("be.visible")
      .contains(issueDetails.title)
      .should("be.visible")
      .click();
    this.getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.get(this.timeEstimationField)
          .should("have.value", valueAmount)
          .and("be.visible");
      });
  }
  // TIME TRACKING AND LOGGING REALLL
  closeDetailsModal() {
    cy.get(this.closeIcon).first().click();
  }

  addTimeEstimation(valueAmount) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField).click().type(valueAmount);
      cy.contains("Updated at").click();
      cy.wait(3000);
    });
  }

  clearExistingTimeTracking() {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.trackingIcon)
        .next()
        .children()
        .eq(1)
        .should("contain", "2h logged")
        .and("contain", "10h estimated")
        .and("be.visible")
        .click();
    });
    cy.get(this.timeTrackingModal)
      .should("be.visible")
      .within(() => {
        cy.get(this.timeEstimationField)
          .first()
          .should("have.value", 2)
          .and("be.visible")
          .clear();
        cy.get("button").should("contain", "Done").click();
      });
    cy.get(this.timeTrackingModal).should("not.exist");
    this.getIssueDetailsModal().within(() => {
      cy.get(this.trackingIcon)
        .next()
        .children(1)
        .should("contain", "No time logged")
        .and("contain", "10h estimated");
      cy.get(this.timeEstimationField)
        .should("have.value", 10)
        .and("be.visible")
        .clear();
      cy.contains("Updated at").click();
      cy.wait(3000);
      // Checking if time tracking is set to default(no values)
      cy.get(this.trackingIcon)
        .next()
        .children(1)
        .should("contain", "No time logged");
      cy.get(this.timeEstimationField)
        .should("have.value", "")
        .and("have.attr", "placeholder", "Number")
        .and("be.visible");
      // Reloading and assuring time tracking values stay the same
      this.closeDetailsModal();
    });
    cy.reload();
    cy.get(this.doneList)
      .should("be.visible")
      .contains(this.newIssueTitle)
      .click();
    this.getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.get(this.trackingIcon)
          .next()
          .children(1)
          .should("contain", "No time logged")
          .and("be.visible");
        cy.get(this.timeEstimationField)
          .should("have.value", "")
          .and("have.attr", "placeholder", "Number")
          .and("be.visible");
      });
  }
  /* not sure
  assertDefaultState(previousValue) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField)
        .should("have.value", previousValue)
        .and("be.visible");
      cy.get(this.trackingIcon)
        .next()
        .children(1)
        .should("contain", "4h logged")
        .and("contain", `${previousValue}h estimated`)
        .and("be.visible");
    }); 
  }*/

  assertAddedTimeEstimationVisibility(valueAmount) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField)
        .should("have.value", valueAmount)
        .and("be.visible");
      cy.get(this.closeIcon).first().click();
    });
    cy.get(this.issueDetailsModal).should("not.exist");
    cy.reload();
    cy.get(this.doneList)
      .should("be.visible")
      .contains(this.newIssueTitle)
      .should("be.visible")
      .click();
    this.getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.get(this.timeEstimationField)
          .should("have.value", valueAmount)
          .and("be.visible");
      });
  }

  /* clickEdit(valueAmount) {
    this.getIssueDetailsModal().within(() => {
      cy.get('input[placeholder="Number"]')
        .should("have.value", "")
        .and("be.visible")
        .click()
        .type(valueAmount);
      cy.contains("Updated at").click();
      cy.wait(5000);
      cy.get(this.trackingIcon)
        .next()
        .children(1)
        .should("contain", "No time logged")
        .and("be.visible")
        .next("div")
        .should("contain", `${valueAmount}h estimated`)
        .and("be.visible");
    });
  }
    */
}

export default new IssueCommentsAndTime();
