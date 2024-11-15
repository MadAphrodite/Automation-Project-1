class IssueCommentsAndTime {
  constructor() {
    this.issueDetailsModal = '[data-testid="modal:issue-details"]';
    this.issueComment = '[data-testid="issue-comment"]';
    this.doneList = '[data-testid="board-list:done"]';
    this.closeIcon = '[data-testid="icon:close"]';
    this.trackingIcon = '[data-testid="icon:stopwatch"]';
    this.timeEstimationField = 'input[placeholder="Number"]';
    this.addCommentField = "Add a comment...";
    this.addCommentTextarea = 'textarea[placeholder="Add a comment..."]';
    this.confirmDeletePopup = '[data-testid="modal:confirm"]';
    this.confirmCommentHeading =
      "Are you sure you want to delete this comment?";
    this.confirmCommentText = "Once you delete, it's gone for good.";
    this.comment = "TEST_COMMENT_B";
    this.editedComment = "TEST_COMMENT_EDITED_B";
    this.newIssueTitle = "Try leaving a comment on this issue.";
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
  }

  getIssueDetailsModal() {
    return cy.get(this.issueDetailsModal);
  }

  // COMMENTS

  // Creating a new comment

  addNewComment() {
    this.getIssueDetailsModal().within(() => {
      cy.contains(this.addCommentField).should("exist").click();
      cy.get(this.addCommentTextarea).type(this.comment);
      this.clickSaveCommentButton();
      cy.contains(this.addCommentField).should("exist");
    });
  }

  cancelAddingNewComment() {
    this.getIssueDetailsModal().within(() => {
      cy.contains(this.addCommentField).should("exist").click();
      cy.get(this.addCommentTextarea).type(this.comment);
      this.clickCancelCommentButton();
      cy.contains(this.addCommentField).should("exist");
    });
  }

  assertCancelledNewCommentDoesNotExist() {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.issueComment)
        .should("have.length", "1")
        .contains(this.comment)
        .should("not.exist");
    });
    cy.reload();
    cy.wait(10000);
    this.getIssueDetailsModal()
      .find(this.issueComment)
      .should("have.length", "1")
      .contains(this.comment)
      .should("not.exist");
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

  // Editing a comment

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

  // Deleting a comment

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

  // TIME ESTIMATION

  closeDetailsModal() {
    cy.get(this.closeIcon).first().click();
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
      // Asserting time tracking is set to default(no values)
      this.assertDefaultTimeTrackingValues();
      // Reloading and assuring time tracking values stay the same
      this.closeDetailsModal();
    });
    cy.reload();
    cy.get(this.doneList)
      .should("be.visible")
      .contains(this.newIssueTitle)
      .should("be.visible")
      .click();
    this.getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        this.assertDefaultTimeTrackingValues();
        cy.get(this.trackingIcon)
          .next()
          .children(1)
          .should("not.contain", "10h estimated");
      });
  }

  assertDefaultTimeTrackingValues() {
    cy.get(this.trackingIcon)
      .next()
      .children(1)
      .should("contain", "No time logged")
      .and("be.visible");
    cy.get(this.timeEstimationField)
      .should("have.value", "")
      .and("have.attr", "placeholder", "Number")
      .and("be.visible");
  }

  // Adding estimation

  addTimeEstimation(valueAmount) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField).click().type(valueAmount);
      cy.contains("Updated at").click();
      cy.wait(3000);
    });
  }

  assertAddedTimeEstimationVisibility(valueAmount) {
    this.getIssueDetailsModal().within(() => {
      this.getEstimationFieldWithValue(valueAmount);
      this.getEstimationWithNoTimeLogged(valueAmount);
      this.closeDetailsModal();
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
        this.getEstimationFieldWithValue(valueAmount);
        this.getEstimationWithNoTimeLogged(valueAmount);
      });
  }

  getEstimationWithNoTimeLogged(valueAmount) {
    cy.get(this.trackingIcon)
      .next()
      .children(1)
      .should("contain", "No time logged")
      .and("contain", `${valueAmount}h estimated`)
      .and("be.visible");
  }

  getEstimationFieldWithValue(valueAmount) {
    cy.get(this.timeEstimationField)
      .should("have.value", valueAmount)
      .and("be.visible");
  }

  // Updating estimation

  updateTimeEstimation(valueAmount, newValueAmount) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField)
        .should("have.value", valueAmount)
        .clear()
        .type(newValueAmount);
      cy.contains("Updated at").click();
      cy.wait(3000);
    });
  }

  assertUpdatedTimeEstimationVisibility(newValueAmount) {
    this.getIssueDetailsModal().within(() => {
      this.getUpdatedEstimationFieldWithValue(newValueAmount);
      this.getUpdatedEstimationWithNoTimeLogged(newValueAmount);
      this.closeDetailsModal();
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
        this.getUpdatedEstimationFieldWithValue(newValueAmount);
        this.getUpdatedEstimationWithNoTimeLogged(newValueAmount);
      });
  }

  getUpdatedEstimationWithNoTimeLogged(newValueAmount) {
    cy.get(this.trackingIcon)
      .next()
      .children(1)
      .should("contain", "No time logged")
      .and("contain", `${newValueAmount}h estimated`)
      .and("be.visible");
  }

  getUpdatedEstimationFieldWithValue(newValueAmount) {
    cy.get(this.timeEstimationField)
      .should("have.value", newValueAmount)
      .and("be.visible");
  }

  // Deleting estimation

  clearTimeEstimation(newValueAmount) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.timeEstimationField)
        .should("have.value", newValueAmount)
        .clear();
      cy.contains("Updated at").click();
      cy.wait(3000);
    });
  }

  assertDeletedTimeEstimationVisibility(newValueAmount) {
    this.getIssueDetailsModal().within(() => {
      this.assertDefaultTimeTrackingValues();
      this.closeDetailsModal();
    });
    cy.reload();
    cy.get(this.doneList)
      .should("be.visible")
      .contains(this.newIssueTitle)
      .should("be.visible")
      .click();
    this.getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        this.assertDefaultTimeTrackingValues();
        cy.get(this.trackingIcon)
          .next()
          .children(1)
          .should("not.contain", `${newValueAmount}h estimated`);
      });
  }

  // TIME LOGGING IN TIME TRACKING

  // Adding time log

  clickTrackingIcon() {
    cy.get(this.trackingIcon).click();
  }

  addTimeTracking(valueSpent, valueRemaining) {
    this.clickTrackingIcon();
    cy.get(this.timeTrackingModal)
      .should("be.visible")
      .within(() => {
        this.typeValuesToTimeTrackingFields(valueSpent, valueRemaining);
      });
    cy.get(this.timeTrackingModal).should("not.exist");
  }

  typeValuesToTimeTrackingFields(valueSpent, valueRemaining) {
    cy.contains("Time spent")
      .next()
      .children("input")
      .should("have.attr", "placeholder", "Number")
      .and("be.visible")
      .click()
      .type(valueSpent);
    cy.contains("Time remaining")
      .next()
      .children("input")
      .should("have.attr", "placeholder", "Number")
      .and("be.visible")
      .click()
      .type(valueRemaining);
    cy.get("button").should("contain", "Done").click();
  }

  assertAddedTimeTrackingVisibility(valueAmount, valueSpent, valueRemaining) {
    this.getIssueDetailsModal().within(() => {
      this.getEstimationFieldWithValue(valueAmount);
      this.getTimeTrackingData(valueAmount, valueSpent, valueRemaining);
      this.closeDetailsModal();
    });
    cy.reload();
    cy.get(this.doneList)
      .should("be.visible")
      .contains(this.newIssueTitle)
      .should("be.visible")
      .click();
    this.getIssueDetailsModal().within(() => {
      this.getEstimationFieldWithValue(valueAmount);
      this.getTimeTrackingData(valueAmount, valueSpent, valueRemaining);
    });
  }

  getTimeTrackingData(valueAmount, valueSpent, valueRemaining) {
    cy.get(this.trackingIcon)
      .next()
      .children(1)
      .should("contain", `${valueSpent}h logged`)
      .and("contain", `${valueRemaining}h remaining`)
      .and("be.visible")
      .and("not.contain", "No time logged")
      .and("not.contain", `${valueAmount}h estimated`);
  }

  // Removing time log

  removeTimeTracking(valueSpent, valueRemaining) {
    this.clickTrackingIcon();
    cy.get(this.timeTrackingModal)
      .should("be.visible")
      .within(() => {
        this.clearTimeTrackingValues(valueSpent, valueRemaining);
      });
    cy.get(this.timeTrackingModal).should("not.exist");
  }

  assertRemovedTimeTrackingVisibility(valueAmount, valueSpent, valueRemaining) {
    this.getIssueDetailsModal().within(() => {
      this.getEstimationFieldWithValue(valueAmount);
      this.getEstimationWithNoTimeLogged(valueAmount);
      this.getNotContainTrackingData(valueSpent, valueRemaining);
      this.closeDetailsModal();
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
        this.getEstimationFieldWithValue(valueAmount);
        this.getEstimationWithNoTimeLogged(valueAmount);
        this.getNotContainTrackingData(valueSpent, valueRemaining);
      });
  }

  getNotContainTrackingData(valueSpent, valueRemaining) {
    cy.get(this.trackingIcon)
      .next()
      .children(1)
      .should("not.contain", `${valueSpent}h logged`)
      .and("not.contain", `${valueRemaining}h remaining`);
  }

  clearTimeTrackingValues(valueSpent, valueRemaining) {
    cy.contains("Time spent")
      .next()
      .children("input")
      .should("have.value", valueSpent)
      .and("be.visible")
      .clear();
    cy.contains("Time remaining")
      .next()
      .children("input")
      .should("have.value", valueRemaining)
      .and("be.visible")
      .clear();
    cy.get("button").should("contain", "Done").click();
  }
}

export default new IssueCommentsAndTime();
