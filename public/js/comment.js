let prepage = 3,
    page = 1,
    pages = 0,
    comments = [];

$('#messageBtn').on('click', function () {
    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            contentId: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success(responseData) {
            $('#messageContent').val('');
            comments = responseData.data.comments.reverse();
            renderComment();
        }
    });
});

/* 每次页面重载获取该文章的评论 */

$.ajax({
    url: '/api/comment',
    data: {
        contentId: $('#contentId').val()
    },
    success: (responseData) => {
        comments = responseData.data.reverse();
        renderComment();
    }
});

$('.pager').on('click', '.clear li a', function () {

    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment();

});

function renderComment() {

    $('#messageCount').html(comments.length);

    let $list = $('.pager li'),
        start = Math.max(0, (page - 1) * prepage),
        end = Math.min(start + prepage, comments.length);

    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    $list.eq(1).html(page + '/' + pages);

    if (page <= 1) {
        page = 1;
        $list.eq(0).html('<span>没有上一页了</span>');
    } else {
        $list.eq(0).html('<a href = "javascript:;">上一页</a>')
    }
    if (page >= pages) {
        page = pages;
        $list.eq(2).html('<span>没有下一页了</span>')
    } else {
        $list.eq(2).html('<a href = "javascript:;">下一页</a>')
    }

    let html = '';

    if (comments.length === 0) {

        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');

    } else {
        for (let i = start; i < end; i++) {
            html += `
            <div class = "messageBox">
                 <p class = "name clear">
                     <span class = "fl">${comments[i].username}</span>
                     <span class = "fr">${formatDate(comments[i].postTime)}</span>
                     <p>${comments[i].content}</p>
                 </p>
            </div> 
            `
        }
        $('.messageList').html(html);
    }

};

/* 格式化时间 */
function formatDate(time) {

    let dateT = new Date(time);

    return dateT.getFullYear() + '-' + (dateT.getMonth() + 1) + '-' + dateT.getDay() + ' ' + dateT.getHours() + ':' + dateT.getMinutes() + ':' + dateT.getSeconds()
};

