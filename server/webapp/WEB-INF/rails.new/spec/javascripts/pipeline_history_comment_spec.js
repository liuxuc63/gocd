describe("PipelineHistoryComment", function() {
    var fakeModalBox = jasmine.createSpyObj('Modalbox', ['hide', 'show']);
    var fakeDashboardPeriodicalExecuter = jasmine.createSpyObj('DashboardPeriodicalExecuter', [ 'fireNow' ]);

    var pipelineHistoryComment = initPipelineHistoryComment(jQuery, fakeModalBox, fakeDashboardPeriodicalExecuter);

    describe("#showModal", function() {
        beforeEach(function() {
            setFixtures('<div id="comment-form-1"></div>');
        });

        it("shows the modal with the correct build comment form", function () {
            pipelineHistoryComment.showModal('test-pipeline', '1');
            expect(fakeModalBox.show).toHaveBeenCalledWith(jQuery('#comment-form-1')[0], { title: 'Comment on test-pipeline build 1' });
        });
    });

    describe("#submit", function() {
        beforeEach(function() {
            setFixtures('<input type="text" id="comment-input" value="This is the comment."/>');
        });

        it("submits a request with the new modal text", function() {
            spyOn(jQuery, 'post');
            pipelineHistoryComment.submit('test-pipeline', '1');
            expect(jQuery.post).toHaveBeenCalledWith(
                '/go/pipelines/test-pipeline/1/comment',
                { comment: 'This is the comment.' },
                pipelineHistoryComment.onCommentSuccessCloseModalAndRefreshPipelineHistory,
                'json');
        });
    });

    describe("#onCommentSuccessCloseModalAndRefreshPipelineHistory", function() {
        it("closes the modal box", function() {
            pipelineHistoryComment.onCommentSuccessCloseModalAndRefreshPipelineHistory();
            expect(fakeModalBox.hide).toHaveBeenCalled();
        });

        it("refreshes the pipeline history", function() {
            pipelineHistoryComment.onCommentSuccessCloseModalAndRefreshPipelineHistory();
            expect(fakeDashboardPeriodicalExecuter.fireNow).toHaveBeenCalledWith();
        });

    });
});